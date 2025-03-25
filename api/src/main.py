from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
import csv
import time

from fastapi import (
    HTTPException,
    FastAPI,
    Response,
)

class SalesData:

    date: str
    sentiment: str
    region: str
    issue: str
    model: str

    def __init__(self):
        self.date = []
        self.sentiment = []
        self.region = []
        self.issue = []
        self.model = []

    def append_row(self, row):
        self.date.append(row['post_date'])
        self.sentiment.append(row['feedback_sentiment'])
        self.region.append(row['country_code'])
        self.issue.append(row['feedback_subcategory'])
        self.model.append(row['model'])

    def as_json(self):
        return {
            'date': self.date,
            #'sentiment': self.sentiment,
            'region': self.region,
            'issue': self.issue,
            #'model': self.model,
        }

    @staticmethod
    def from_csv(filename: str):
        with open(filename, newline='') as csvFile:
            csvReader = csv.DictReader(csvFile)

            obj = SalesData()

            for row in csvReader:
                obj.append_row(row)

            return obj


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ['http://localhost:3000'],
)
salesData = SalesData.from_csv('../interview-data.csv')

@app.get("/heartbeat")
async def get_root():
    return {"status": "alive"}

@app.get("/sales-data")
async def get_sales_data():
    return salesData.as_json()
