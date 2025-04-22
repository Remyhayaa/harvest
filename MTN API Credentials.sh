# Secure production credentials:
curl -X POST https://momodeveloper.mtn.com/v1_0/apikey \
-H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY" \
-H "Authorization: Basic $BASE64_CREDS"