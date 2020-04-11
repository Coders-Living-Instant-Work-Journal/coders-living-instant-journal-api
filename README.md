# API interaction: 


## User routes

- `POST/signup` --> returns a token: <string>
  ```
  [BODY]
  email: <string>
  password: <string>
  ```

- `POST /signin` --> returns a token: <string>
  ```
  [HEADERS]
  'Authorization': 'Basic <base64encoded user/pass>'
  ```


## Entry routes

- `POST /create` --> returns copy of created entry in body
  ```
  [RESPONSE]

  {
    "entry": {
        "_id": <mongodb id of the note>,
        "category": <the category>,
        "date": "2020-04-11T20:31:17.000Z", <date it was created>
        "text": <content of the note>,
        "userId": <user who owns this note>
        "journalId": {
            "_id": <mongodb journal id>,
            "entryIds": [
              <array of note id's in this journal. Does not include this just-added entry>
            ],
            "name": <journal name>,
            "userId": <user id who owns this journal>
        },
    }
  }

  [HEADERS]
  'Authorization": "Bearer <bearer token>"
  [BODY]
   name: <string>
   category: <string>
   text: <string>

   [NOTE]
   (the currently selected journal will be the journal this new note gets assigned to)
  ```

- `GET /read` --> returns an array of entries. 
  ```

  [RESPONSE]

  [
    {
        "_id": "<mongodb note id>,
        "category": <category>
        "date": "2020-04-11T20:31:17.000Z", <date created>
        "text": <content of note>,
        "userId": <user id>
        "journalId": {
            "_id": <journal id>,
            "entryIds": [
                <ids of all entries>
            ],
            "name": <name of journal>
            "userId": <id of user>
        },
    },
    ...
  ]

  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  startDate? : 
  endDate? : 
  category? : 
  id ?: < the id of the note you want>
  ```

- `PUT /update` -->  returns a message : string.
  ```
  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  one or more of the following: 
  id? :
  text? :
  category? :
  
  ```
- `DELETE /delete` -->  returns a message : string.
  ```
  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  id :
  ```

  ## Journal routes.

- `POST /selectj` -->  returns a string indicating which journal is now selected
  ```
  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  jId: the id of the journal you are selecting
  
  ```
- `POST /createj` -->  returns a string indicating the name of the journal that was created
  ```
  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  name: <string>
  
  ```
- `GET /readj` -->  returns array of journal objects.

  ```
  [RESPONSE]
    [
      {
        "_id": <journal id>,
        "entryIds": [
          <list of entry id's>
        ],
        "name": <journal name>,
        "userId": <user id>,
    }, 
    ...
  ]


  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  none
  
  ```
  
- `DELETE /deletej` -->  returns a sucess message: string.
deletes all entries in the journal
  ```
  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  id: <id of the journal to be deleted>
  
  ```
