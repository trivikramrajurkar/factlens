from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from lime.lime_text import LimeTextExplainer

import pickle


# Create FastAPI app
app = FastAPI()


# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Load ML model
# -----------------------------

with open(
    "backend/saved_models/random_forest.pkl",
    "rb"
) as f:
    rf_model = pickle.load(f)


with open(
    "backend/saved_models/logistic_regression.pkl",
    "rb"
) as f:
    lr_model = pickle.load(f)


with open(
    "backend/saved_models/svm.pkl",
    "rb"
) as f:
    svm_model = pickle.load(f)


with open(
    "backend/saved_models/vectorizer.pkl",
    "rb"
) as f:
    vectorizer = pickle.load(f)



# -----------------------------
# LIME Explainer
# -----------------------------

explainer = LimeTextExplainer(
    class_names=[
        "FAKE",
        "REAL"
    ]
)



# Function LIME uses internally
def predict_probability(texts):

    vectors = vectorizer.transform(
        texts
    )

    probabilities = lr_model.predict_proba(
        vectors
    )

    return probabilities



# -----------------------------
# Routes
# -----------------------------

@app.get("/")
def home():

    return {
        "message": "FactLens AI + XAI backend running"
    }



@app.post("/predict")
def predict(data: dict):

    text = data["text"]


    # Convert text to TF-IDF numbers
    vector = vectorizer.transform(
        [text]
    )


    # Model prediction
    result = lr_model.predict(
        vector
    )[0]


    probabilities = lr_model.predict_proba(
        vector
    )[0]


    confidence = probabilities.max()


    if result == 1:
        label = "REAL"

    else:
        label = "FAKE"



    # Generate LIME explanation
    explanation = explainer.explain_instance(
        text,
        predict_probability,
        num_features=10
    )


    lime_words = []


    for word, score in explanation.as_list():

        lime_words.append(
            {
                "word": word,
                "score": round(
                    float(score),
                    3
                )
            }
        )



    return {

        "prediction": label,

        "confidence": round(
            float(confidence),
            3
        ),

        "explanation": lime_words

    }

@app.post("/compare")
def compare(data: dict):

    text = data["text"]

    vector = vectorizer.transform(
        [text]
    )


    results = {}


    models = {

        "Random Forest": rf_model,

        "Logistic Regression": lr_model,

        "SVM": svm_model

    }


    for name, current_model in models.items():


        prediction = current_model.predict(
            vector
        )[0]


        if prediction == 1:

            label = "REAL"

        else:

            label = "FAKE"



        results[name] = label



        values = list(
        results.values()
    )


    majority = max(
        set(values),
        key=values.count
    )


    agreement = (
        values.count(majority)
        /
        len(values)
    )


    return {

        "models": results,

        "agreement_score": round(
            agreement,
            2
        )

    }

@app.post("/bias-test")
def bias_test(data: dict):

    original_text = data["text"]


    modified_text = (
        "WASHINGTON Reuters "
        + original_text
    )


    original_vector = vectorizer.transform(
        [original_text]
    )


    modified_vector = vectorizer.transform(
        [modified_text]
    )


    original_prediction = rf_model.predict(
        original_vector
    )[0]


    modified_prediction = rf_model.predict(
        modified_vector
    )[0]



    if original_prediction == 1:

        original_label = "REAL"

    else:

        original_label = "FAKE"



    if modified_prediction == 1:

        modified_label = "REAL"

    else:

        modified_label = "FAKE"



    bias_detected = (
        original_label
        !=
        modified_label
    )



    return {

        "original_prediction": original_label,

        "modified_prediction": modified_label,

        "bias_detected": bias_detected,

        "added_words": "WASHINGTON Reuters"

    }