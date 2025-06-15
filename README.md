# AccessAbleNYC
AccessAbleNYC is an interactive web application that helps users explore accessibility information for locations across New York City. It displays data from OpenNYC to visualize and filter accessible places such as playgrounds, beaches, restrooms, pedestrian signals, and subway stations. The app includes feedback functionality and is powered by a MongoDB database.

### Note
- To run this project .env files are needed in client and server folders to access mongodb database to be able to load markers on the map, as well as sign up
- Data / Datasets are from OpenNYC
	* Some locations may not currently be operational as some data may be outdated


## Homepage
Map with all locations loaded:
![homepage](client/public/readme-img/full.png)

Open 'Filter By' to select certain locations only
![homepage](client/public/readme-img/filter.png)
![homepage](client/public/readme-img/beach.png)

![homepage](client/public/readme-img/playground.png)
![homepage](client/public/readme-img/lights.png)
![homepage](client/public/readme-img/sub.png)
![homepage](client/public/readme-img/toilet.png)
![homepage](client/public/readme-img/login.png)
![homepage](client/public/readme-img/feedback.png)

MongoDb Schema
- Collections
    - all_locations
    - feedback
    - reviews
    - users


## Map Location Filters
- Locations and Filtered Accessibility Options
- Not accessible means it is not accessibility friendly

### Playgrounds
- Accessibility
	- Any
	- Full
	- Partial
	- Not Accessible

### Beaches
- Accessibility
	- Any
	- Full
	- Not Accessible

### Restroom
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

### Pedestrian Signal
- Accessibility
	- Any
	- Accessible
	- Not Accessible

### Subway stop
- Accessibility
	- Any
	- Accessible
	- Not Accessible
	- Unknown
	- Partial ADA
- ADA Status
	- Full ADA accessible
	- Partial ADA accessible



