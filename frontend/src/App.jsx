import { useState } from "react";


function App() {


  const [text, setText] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [bias, setBias] = useState(null);

  const [comparison, setComparison] = useState(null);



  async function analyzeNews() {


    setLoading(true);


    const response = await fetch(
      "http://127.0.0.1:8000/predict",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          text: text
        })

      }
    );


    const data = await response.json();


    setResult(data);

    setLoading(false);


  }




  async function runBiasTest() {


    const response = await fetch(
      "http://127.0.0.1:8000/bias-test",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          text: text
        })

      }
    );


    const data = await response.json();


    setBias(data);


  }





  async function compareModels() {


    const response = await fetch(
      "http://127.0.0.1:8000/compare",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          text: text
        })

      }
    );


    const data = await response.json();


    setComparison(data);


  }







  return (


    <div className="min-h-screen bg-gray-950 text-white p-10">


      <h1 className="text-5xl font-bold">
        FactLens
      </h1>


      <p className="text-gray-400 mt-3 mb-8">
        Explainable AI Platform for Misinformation Analysis
      </p>




      <textarea

        className="
        w-full
        h-48
        bg-gray-900
        border
        border-gray-700
        rounded-xl
        p-5
        "

        placeholder="Paste news article..."

        value={text}

        onChange={(e) => setText(e.target.value)}

      />



      <div className="mt-5">


        <button

          onClick={analyzeNews}

          className="
          bg-blue-600
          px-8
          py-3
          rounded-xl
          "

        >

          Analyze

        </button>





        <button

          onClick={runBiasTest}

          className="
          ml-5
          bg-purple-600
          px-8
          py-3
          rounded-xl
          "

        >

          Run Bias Test

        </button>






        <button

          onClick={compareModels}

          className="
          ml-5
          bg-green-600
          px-8
          py-3
          rounded-xl
          "

        >

          Compare Models

        </button>



      </div>




      {

        loading &&

        <p className="mt-5">
          Analyzing...
        </p>

      }






      {

        result &&


        <div className="mt-10 bg-gray-900 p-5 rounded-xl">


          <h2 className="text-3xl">
            Prediction
          </h2>


          <p className="mt-3">

            Result: {result.prediction}

          </p>


          <p>

            Confidence: {result.confidence}

          </p>



          <h2 className="text-3xl mt-8">

            LIME Explanation

          </h2>




          {

            result.explanation.map(

              (item, index) => (

                <div

                  key={index}

                  className="mt-3"

                >


                  <b>{item.word}</b>


                  {" - "}


                  {

                    item.score > 0

                      ?

                      "Pushes REAL"

                      :

                      "Pushes FAKE"

                  }


                  {" (" + item.score + ")"}



                </div>


              )

            )

          }



        </div>


      }








      {

        bias &&


        <div className="mt-10 bg-gray-900 p-5 rounded-xl">


          <h2 className="text-3xl">

            Bias Analysis

          </h2>



          <p className="mt-3">

            Original: {bias.original_prediction}

          </p>


          <p>

            After adding "{bias.added_words}":

            {" "}

            {bias.modified_prediction}

          </p>




          {

            bias.bias_detected

              ?

              <p className="text-red-400 mt-5">

                ⚠️ Potential Dataset Bias Detected

              </p>


              :

              <p className="text-green-400 mt-5">

                No prediction shift detected

              </p>


          }



        </div>


      }








      {

        comparison &&


        <div className="mt-10 bg-gray-900 p-5 rounded-xl">


          <h2 className="text-3xl">

            Model Comparison

          </h2>




          {

            Object.entries(
              comparison.models
            ).map(

              ([name, prediction]) => (


                <p

                  className="mt-3"

                  key={name}

                >


                  {name}: {prediction}


                </p>


              )

            )

          }




          <p className="mt-5">


            Agreement Score:


            {" "}


            {comparison.agreement_score * 100}%


          </p>




        </div>


      }






    </div>


  )


}


export default App;