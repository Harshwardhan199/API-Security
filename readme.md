Add these in mongoDB in respective collections:

users:-
{
  "_id": {
    "$oid": "691bef269d2663d4f11ea081"
  },
  "username": "admin",
  "password": "password123"
}

{
  "_id": {
    "$oid": "691bef7e9d2663d4f11ea086"
  },
  "username": "test",
  "password": "test123"
}


apiKeys:-
{
  "_id": {
    "$oid": "691bef969d2663d4f11ea089"
  },
  "key": "key-1111-aaaa",
  "owner": "Admin",
  "active": true
}

{
  "_id": {
    "$oid": "691bf0029d2663d4f11ea08c"
  },
  "key": "key-3333-cccc",
  "owner": "Test",
  "active": true
}