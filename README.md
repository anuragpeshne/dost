dost
====

dont do stupid task

This script is created to track price variation on online e commerce site.
Quick How-To:
1. Change the URLs to your desired product URL.
2. Change the Regex if required. 
3. Deploy on Heroku.
	a. Heroku passivates your app if there is no traffic for 1 hour; Hence every 40 minutes Dost sents a requests to (touches) itself to save from falling asleep.
	b. Heroku resets the dyno once a day. Hence if you want to save the price variation statistics then you should save the JSON to a persistent storage. 