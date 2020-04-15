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

## Email routes

- `POST /createEmailProfile` --> returns a json of the email profile
```
    [RESPONSE]
    {
      `_id`: email profile id
      `profileName`: name the user gives this email profile
      `journalId`: journal the user picked for the email profile
      `emailTime`: time of the day the email will be sent
      `entryRange`: number of days back to present the emailer will search for entries
      `emailAddr`: user email
      `category`: category name
      `biWeekly`: set to `true` if the user is selecting the bi-weekly option, otherwise `false`
      `thisWeek`: when `biWeekly` is set to `true`, this value will need to be `true` for for the week the email is to be sent; `false` for the week the e-mail is not to be sent
      `everyMonth`: set to `true` if the user is selecting the monthly option, otherwise `false`
      `dayOfMonth`: array of integers between 1-31; used when `everyMonth` is set to `true`; this field is optional, unless the montly option is selected
      `emailDay`: array of integers with values between 0 - 6. 0 = Sunday, 6 = Saturday
      `userId`: the user associated with this email profile
    }

    [HEADERS]
    'Authorization": "Bearer <bearer token>" 
    [BODY]
    `profileName`: <string>
    `journalId`: <string>
    `emailTime`: <number> (24 hour time, 15 minute increments)
    `entryRange`: <number>
    `emailAddre`: <string>
    `category`: <string>
    `biWeekly`: <boolean>
    `thisWeek`: <boolean>
    `everyMonth`: <boolean>
    `dayOfMonth`: <array[integers]>
    `emailDay`: <array[integers]>    
```

- `GET /readEmailProfiles` --> returns a JSON object with all of the user's email profiles

```
    [RESPONSE]
    [
      {
        same object as /createEmailProfile
      }
    ]

    [HEADERS]
    'Authorization": "Bearer <bearer token>"
    [BODY]
```

- `PUT /updateEmailProfile` --> returns a JSON object with the user's updated email profile

```
    [RESPONSE]
    [
      {
        same object as /createEmailProfile
      }
    ]

    [HEADERS]
    'Authorization": "Bearer <bearer token>"
    [BODY]
    `_id`: <string>
    `profileName`: <string>
    `journalId`: <string>
    `emailTime`: <number>
    `entryRange`: <number>
    `emailAddre`: <string>
    `category`: <string>
    `biWeekly`: <boolean>
    `thisWeek`: <boolean>
    `everyMonth`: <boolean>
    `dayOfMonth`: <array[integers]>
    `emailDay`: <array[integers]> 
```

- `DELETE /deleteEmailProfile` --> returns a JSON object of the user's deleted email profile

```
    [RESPONSE]
    [
      {
        same object as /createEmailProfile
      }
    ]

    [HEADERS]
    'Authorization": "Bearer <bearer token>"
    [BODY]
    id: <string>
```