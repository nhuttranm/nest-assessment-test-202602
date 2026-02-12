# nest-assessment-test-202602
Assessment testing Project

Techstack:
* Framework : NestJS
* Language : NodeJS + Typescript
* Database : MySQL 8
* Cache Service : Redis

Implement Steps
1. Create an API endpoint that can accept 2 parameters “id1” and “id2” by POST method
2. Create a table in MySQL database to store the id1, id2 and a userID
3. When the system receives the request :
a. Check from the database to see if id1 and id2 exist in the table (in the same row)
b. If yes, get the userID and output to response in JSON format
c. If not, generate a userID in UUIDv4 format, insert into table, and then output the userID to response in JSON format
4. Please draw a sequence diagram of your system

Bonus Point
1. Create a DockerFile or docker-compose for deploying the service in docker container