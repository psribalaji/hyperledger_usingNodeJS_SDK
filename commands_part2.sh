# Create the archive
composer archive create  --sourceType dir --sourceName ../ -a pivot1234.bna

# Deploy the archive
composer network deploy -a .\pivot123.bna -c PeerAdmin@hlfv1 -A testuser -S adminpw

#Third Step
 composer network install -a pivot1234.bna -c PeerAdmin@hlfv1


# Create a admin card
 composer network start -c PeerAdmin@hlfv1 -n pivot-test123 -V 0.0.1 -A testuser -S adminpw

# Use the card generated
composer card import -f admin@pivot-test123.card


#Start the REST
composer-rest-server




'{
  "$class": "org.pivot.participant.pivotPublic",
  "participantKey": "P1",
  "profile": {
    "$class": "org.pivot.participant.Profile",
    "fName": "SriBalaji",
    "lname": "P",
    "email": ""
  }
}'


composer participant add -c admin@pivot-test123 -d '{ "$class": "org.pivot.participant.pivotPrivate","participantKey": "privateUser", "profile": {
    "$class": "org.pivot.participant.Profile",
    "fName": "BALAJI_PRIVATE",
    "lname": "B P",
    "email": ""
  }
}'

org.pivot.participant.pivotPublic
