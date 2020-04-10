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
  [HEADERS]
  'Authorization": "Bearer <bearer token>"
  [BODY]
   ---placeholder for entry data ---- 
  ```

- `GET /read` --> returns an array of entries. 
  ```
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
- `POST /createj` -->  returns a copy of created journal body.journal
  ```
  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  ---data for the journal --- need specifics. ask back-end
  
  ```
  
- `DELETE /deletej` -->  returns a sucess message: string.
deletes all entries in the journal
  ```
  [HEADERS]
  'Authorization": "Bearer <bearer token>" 
  [BODY]
  id: id fo the journal to be deleted
  
  ```



- `
