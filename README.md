# AccessAbleNYC
AccessAbleNYC is an interactive web application that helps users explore accessibility information for locations across New York City. It displays data from OpenNYC to visualize and filter accessible places such as playgrounds, beaches, restrooms, pedestrian signals, and subway stations. The app includes feedback functionality and is powered by a MongoDB database.

### Note
- To run this project .env files are needed in client and server folders to access mongodb database to be able to load markers on the map, load map directions as well as sign up
- Data / Datasets are from OpenNYC
	* Some locations may not currently be operational as some data may be outdated


## Homepage
Map with all locations loaded:
![homepage](client/public/readme-img/full.png)

### Map Filter
![Map Filter](client/public/readme-img/filter.png)
### Beaches
![Beaches](client/public/readme-img/beach.png)
### Playgrounds 
![Playgrounds](client/public/readme-img/playground.png)
### Traffic Lights
![Traffic Lights](client/public/readme-img/lights.png)
### Subway stops
![Subway Stops](client/public/readme-img/sub.png)
### Public Restrooms
![Public Restrooms](client/public/readme-img/toilet.png)
### Search
- All locations in the database are searchable
![Search 1](client/public/readme-img/search1.png)
![Search 2](client/public/readme-img/search2.png)
### Map Directions
- Shows accessible walking route between 2 locations (map marker & search or your current loction), taking into account accessible traffic lights
- Not always the most efficient route
![Map Directions 1](client/public/readme-img/mapdirections1.png)
![Map Directions 2](client/public/readme-img/mapdirections2.png)

### Sign up page
![Sign Up Page](client/public/readme-img/signup.png)
### Login Page
![Login Page](client/public/readme-img/login.png)
### Feedback Page 
![Feedback Page](client/public/readme-img/feedback.png)


MongoDb Schema
- Collections
    - all_locations
    - feedback
    - reviews
    - users

## Map Location Filters
- Locations and Filtered Accessibility Options
- Not accessible means it is not accessibility friendly

#### Playgrounds
- Accessibility
	- Any
	- Full
	- Partial
	- Not Accessible

#### Beaches
- Accessibility
	- Any
	- Full
	- Not Accessible

#### Public Restrooms
- Accessibility
	- Any
	- Full
	- Partial
	- Not Accessible 
- Restroom Type
	- Single-Stall
	- Multi-Stall
	- Both
- Operator
	- NYC Parks
	- BPL
	- Park Avenue Plaza Owner LLC
	- NYC DOT / JCDecaux

#### Pedestrian Signals
- Accessibility
	- Any
	- Accessible
	- Not Accessible

#### Subway stops
- Accessibility
	- Any
	- Accessible
	- Not Accessible
	- Unknown
	- Partial ADA
- ADA Status
	- Full ADA accessible
	- Partial ADA accessible



