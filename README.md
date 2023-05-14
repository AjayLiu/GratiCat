# GratiCat
## An AI-backed mentality booster made for SB HACKS

## What we learned
Link to Hackathon presentation: https://www.canva.com/design/DAFi60nvnhc/PsqNYglT9VJB4Oc6XHJnNQ/view?utm_content=DAFi60nvnhc&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink

## Inspiration
😊 According to a study conducted by Harvard University, gratitude helps people feel more positive emotions, relish good experiences, improve their health, deal with adversity, and build strong relationships.

❤️ With our cute mascot GratiCat, we hope our app makes practicing gratitude fun, cultivating a good habit seamlessly into users' lives. 

## What it does
🔒 Upon logging in with your phone number, you are prompted to write down anything you are grateful for to unlock the app. Every day, if the user has not submitted a gratitude note within the last 24 hours, the app will lock out all its features until the user writes down something they are grateful for. 

☕️ With every gratitude note submitted, the user sees GratiCat's coffee cup fill up more and more, motivating them to submit more than once a day.

🤖 On the profile page, NLP methods categorize each gratitude entry  
to generate a pie chart showing the top recurring themes among the user's past gratitude submissions. Additionally, an insightful summary captures the user's values.

## How we built it
React Native

Typescript

Open AI API

Firebase

Expo

Github


## Challenges we ran into
We originally wanted to use large scale AI models provided by Google Cloud as both a venture into the Cloud Computing space and a leverage of industry level resources, however, we found for our lightweight app, the authethication process and ease of use issues were not ideal, thus, leading us to choose a different API service.

Additionally, we ran into issues formatting the queries for the Firebase database, leading to slower loading times. Likewise, our team was not familiar with the Authethication process under Firebase, but was able to take this as a learning experience as we eventually did get phone verification set up.

We also had issues with React Native and Expo in both the authethication process and software compatilbility, as certain IOS versions weren't supported and required unusual work-a-rounds.

## Accomplishments that we're proud of

☕️ We're proud of the vision and purpose behind this app, to promote mental health awareness and to look at life with the coffee cup half full. 

This was all our first time at a hackathon and many of us are complete beginners with the tools we were using to build this app. We're extremely fulfilled to have brought together so many different skill sets (web dev, database management, natural language processing, UI/UX design) towards a common goal. We all stepped out of our comfort zones to learn about each others' fields of expertise.

## What we learned

Although we struggled from the time-constrainted environment, we were able to cooperate effectively through Git, all while maintaining a strong mentality. 

On the tech side, we were able to learn how to micromanage token costs, the importance of git control and likewise consistency in checking security when pushing files (one of us leaked the API key at one time), how to apply linear algebra in the comparision of vectors, gaining more familiarity with React, and how to handle git conflicts.

## What's next for GratiCat

We'd like to emulate the feeling of sending and receiving cards from to and from your friends. We plan on using more of Firebase's services to create a messaging service to let users share their thanks and likewise, share the enjoyment of finding value in everyday things. We would like to fully fashion out the profile screen with friends and allow users to add images as a backdrop to cards that they send to one another. 

And also, more cats! 😼
