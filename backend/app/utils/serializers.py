from bson import ObjectId

def serialize_mongo(doc):
    if not doc:
        return None

    doc["id"] = str(doc["_id"]) 
    doc["_id"] = str(doc["_id"])

    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif isinstance(value, list):
            doc[key] = [str(i) if isinstance(i, ObjectId) else i for i in value]

    return doc