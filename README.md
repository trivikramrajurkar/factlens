# FactLens: Explainable AI Platform for Misinformation Analysis

## Overview

FactLens is a full-stack Explainable AI (XAI) platform designed to analyze misinformation detection models.

Instead of only predicting whether an article is real or fake, FactLens investigates why a model made its decision and detects potential dataset biases.

## Motivation

Traditional fake news classifiers often achieve high test accuracy but fail on real-world examples due to dataset artifacts and shortcut learning.

This project explores model interpretability and robustness using explainable AI techniques.

## Features

- Fake news prediction using Machine Learning
- TF-IDF based NLP pipeline
- Multiple model comparison:
  - Logistic Regression
  - Support Vector Machine
  - Random Forest
- LIME based explanations
- Word-level feature importance analysis
- Counterfactual source-bias testing
- Model agreement score

## Tech Stack

Frontend:
- React
- Tailwind CSS

Backend:
- FastAPI
- Python

Machine Learning:
- Scikit-Learn
- TF-IDF
- LIME

## Architecture

User Input
↓
React Interface
↓
FastAPI Backend
↓
TF-IDF Vectorization
↓
ML Models
↓
Prediction + Explanation + Bias Analysis


## Research Finding

Experiments showed that models trained on fake news datasets may learn source-related artifacts.

Example:

Article:
"NASA announced a satellite mission"

Prediction:
FAKE

Modified article:
"WASHINGTON Reuters NASA announced a satellite mission"

Prediction:
REAL

This indicates potential shortcut learning rather than semantic understanding.

## Future Improvements

- Transformer-based models (BERT)
- SHAP explanations
- Larger real-world datasets
- Advanced bias evaluation metrics
