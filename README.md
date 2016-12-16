AWS Lambda function for Salah Timings

A AWS Lambda function that demonstrates the following use cases for Salah Timings

Get the prayer timings for a place
Get the prayer timings for a place on a specific date
Get the specific prayer timings for a place
Get the specific prayer timings for a place on a specific date

"Alexa, ask salah timings for prayer timings in Houston"

"Alexa, ask salah timings for prayer timings in Houston for tomorrow"

"Alexa, ask fajr timings in Houston"

"Alexa, ask fajr timings in Houston for tomorrow"



Setup

To run this Salah Timings skill you need to do three things. The first is to setup API key from http://muslimsalat.com/ then deploy the example code in lambda and configure the Alexa skill to use Lambda

Salah Timings API Key Setup

Signup at http://muslimsalat.com/panel/signup.php to get the api key 

Go to the AWS Console and click on the Lambda link. Note: ensure you are in us-east or you won't be able to use Alexa with Lambda.
Click on the Create a Lambda Function or Get Started Now button.
Name the Lambda Function "salahTimings".
Go to the the src directory, select all files and folders and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
Upload the .zip file to the Lambda
Select the Runtime as Node.js 4.3
Keep the Handler as index.handler (this refers to the main js file in the zip).
Select role as alexa and keep other configuration as it is.
Return to the main Lambda page, and click on "Events Sources" tab and click "Add Event Source".
Choose Alexa Skills Kit and click submit.
Copy the ARN from the upper right to be used later in the Alexa Skill Setup
Alexa Skill Setup

Go to the Alexa Developer Console and click Add a New Skill.
Select Skill Type Custom Interaction Model
Set "Salah Timings" as the skill name and "salah timings" as the invocation name, this is what is used to activate your skill. For example you would say: "Get the prayer timings for a place." Click Next.
Copy the Intent Schema from the included file speechAssets/IntentSchema.json.
Go to custom slot, add type AMAZON.US_CITY and copy the type values from the included file speechAssets/AMAZON.US_CITY.text file.
Go to custom slot, add type LIST_LOCATION and copy the type values from the included file speechAssets/LIST_LOCATION.text file.
Go to custom slot, add type LIST_OF_PRAYER and copy the type values from the included file speechAssets/LIST_OF_PRAYER file.
Copy the Sample Utterances from the included file speechAssets/SampleUtterances.txt. Click Next.
Select the Lambda ARN for the skill Endpoint and paste the ARN copied from above.
Select Account Linking to No. Click Next.
[optional] go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable APP_ID, then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source.
You are now able to start testing your sample skill! You should be able to go to the Echo webpage and see your skill enabled.
Your skill is now saved and once you are finished testing you can continue to publish your skill.