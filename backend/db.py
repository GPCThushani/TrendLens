from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import json

engine = create_engine('sqlite:///trendlens.db', echo=False)
Base = declarative_base()
Session = sessionmaker(bind=engine)

class QueryResult(Base):
    __tablename__ = 'queries'
    id = Column(Integer, primary_key=True)
    keyword = Column(String, index=True)
    result_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)

def save_result(keyword, result):
    s = Session()
    qr = QueryResult(keyword=keyword, result_json=json.dumps(result))
    s.add(qr)
    s.commit()
    s.close()
