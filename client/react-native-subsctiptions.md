
In this tutorial I walk through how to add in app purchases (**IAP**) to your **React Native** app for iOs.

### What you need

1.  An [apple developer account.](https://appleid.apple.com/account?appId=632&returnUrl=https://developer.apple.com/account/)
2.  An apple device to test on. You can't as of this writing test **IAP** on a simulator.

### Step by step instructions

1.  Setup a React native project and add react-native-iap dependency.
    - **Prerequisite**: [Setup development environment for react native.](https://www.youtube.com/watch?v=h__0hghQBi8)
2.  Signup for an apple developer account if you don't already have one.
3.  Configure Xcode for React Native IAP
4.  Add your app in your Apple developer account.
5.  Add subscriptions to your app in your Apple developer account.
6.  Create App-Specific shared secret
7.  Add Sandbox users in appstoreconnect
8.  Integrate IAP and add screens and navigation to your project.
9.  Test the in app purchase on your device.

### 1. Setup React Native Project

Assuming you are on a mac, open your terminal and cd into a directory where you'd like to add your new project. For example on my mac I created a directory called rnapps

`cd /Users/Shared/dev/rnapps`

Then run the command below to create your project. I called mine cwgiapexample for demonstration purposes. You can name yours something else.

    npx react-native init cwgiapexample

Let's install the depencies. And run our app to make sure everything looks good so far. Run the following commands to `cd` to the project directory and install dependencies.

    cd cwgiapexample
    npm i

Let's add our react-native-iap and navigation dependencies.

    npm i react-native-iap @react-navigation/native @react-navigation/stack react-native-gesture-handler react-native-dotenv --save
    npx pod-install ios

Start metro server and run the app.

    npx react-native start

Open a new terminal to run the app. You can use Command + T to open a new terminal in a tab. This should open your app in the simulator.

    npx react-native run-ios

To stop the app and shut it down, close the simulator and run Ctrl+c in the metro server terminal.

### 2. Signup for an apple developer account.

If you don't already have an account, head over to the [apple developer website](https://appleid.apple.com/account?appId=632&returnUrl=https://developer.apple.com/account/) and signup for an account. Make sure you have signed all agreements and setup tax and banking info. IAP will not work otherwise.

### 3. Configure Xcode for React Native IAP

From Xcode, go to the file menu and select open to open the Xcode file with the extension **.xcworkspace**

Then select the project in the top left menu and select **Signing and Capabilites** tab. Choose your team (you may need to sign in with your developer account.) and then enter an inverse url for the Bundle identifier. This is how it’s identified in App Store connect. For example I named mine `com.codewithgigi.cwgiapexample`

Now to add the IAP capability, select the `+ Capability` in the top left hand corner of the Signing and Capabilities tab. In the drop down search for purchase and you should see an option for `In-App Purchase`. Double click on it add it.

### 4. Add your App in your Apple developer account

Go to identifiers in apple developer account and check to see if the bundle identifier you just created exists. If not you can add it here.

Next goto [App Store connect](https://appstoreconnect.apple.com/) in your browser and sign in to your developer account.

Click on my apps and click the add icon to add an app. Select iOS, the name and select the bundle id we just setup in Xcode. Add the SKU and select full access.

> _Add whatever you want for the SKU, it's a unique id that is not visible in the App Store._

> _The user access is not the app users but for your other developers._

If you don’t see your bundle identifier you can set it in your [Apple developer account](apple.developer.com/account). Select **identifiers** under the certificate identifiers and profiles

Select the Add icon -> select appId’s and set the bundle id to the same bundle id you set in Xcode.

### 5. Add subscriptions to your app in your Apple developer account

Now we need to **_add subscription products_**. Back in [appstoreconnect](https://appstoreconnect.apple.com/apps/), select your app. On the app screen select the drop down next to iOS App 1.0, scroll down and select **Subscriptions** under the **Features** section

Create a subscription group with a descriptive name of your choice. After you same the group select create under the Subscriptions and add a reference name and product id. After you save it. Select it from the Subscriptions. Enter the duration, price, add localizations and save.

Next add App Store localization and add your products name and description. We'll be displaying this in our app.

> _For subscriptions you can add introductory price, for example 2 weeks free on a monthly subscription. To do this select the “View all
> subscription pricing” and then select the Introductory Offers. This
> will walk you through setup of a free trial or to setup a code for
> discount etc._

### 6. Create App-Specific shared secret

The app-specific shared secret is a unique code to receive receipts for this app’s auto-renewable subscriptions.  
In appstoreconnect select app information from the left navigation and scroll to the App-Specific Shared Secret section and click on manage and then generate. Save the generated secret.

Back in VSCode, create a file called .env in the root of your project and add the following code to it and save it.

    APP_SHARED_SECRET=YourGENERATEDCodeGoesHere

Now we need to add a dependency to use our .env file.

    npm i react-native-dotenv --save

> _Make sure you add .env to your .gitignore so that you don't share this file._

App Store connect -> users and Access -> sandbox testers -> add icon to add your user to test the in app purchase.

### 7. Add Sandbox users in appstoreconnect

Got to [appstoreconnect](https://appstoreconnect.apple.com/) and select Users & Access.
and then goto the Sandbox Testers tab and add a new user.

> Note on creating multiple test users: Gmail will forward emails if you add + at the end of your email name, for example codingwithgigi+1@gmail.com will be forwarded to codingwithgigi@gmail.com so you can create as many sandbox accounts as you like.

### 8. Integrate IAP and add screens and navigation to your project.

First we'll add two new screens to our app. One to display the Subscriptions. And one for the Home screen which the user is navigated to after successful payment. Put both of these files in a new direcory called src/screens in the root of your project.

> src/screens/Subscriptions.js

```js
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import {
  PurchaseError,
  requestSubscription,
  useIAP,
  validateReceiptIos,
} from "react-native-iap";
import { ITUNES_SHARED_SECRET } from "@env";

const errorLog = ({ message, error }) => {
  console.error("An error happened", message, error);
};

const isIos = Platform.OS === "ios";

//product id from appstoreconnect app->subscriptions
const subscriptionSkus = Platform.select({
  ios: ["cwgmonthly299"],
});

export const Subscriptions = ({ navigation }) => {
  //useIAP - easy way to access react-native-iap methods to
  //get your products, purchases, subscriptions, callback
  //and error handlers.
  const {
    connected,
    subscriptions, //returns subscriptions for this app.
    getSubscriptions, //Gets available subsctiptions for this app.
    currentPurchase, //current purchase for the tranasction
    finishTransaction,
    purchaseHistory, //return the purchase history of the user on the device (sandbox user in dev)
    getPurchaseHistory, //gets users purchase history
  } = useIAP();

  const [loading, setLoading] = useState(false);

  const handleGetPurchaseHistory = async () => {
    try {
      await getPurchaseHistory();
    } catch (error) {
      errorLog({ message: "handleGetPurchaseHistory", error });
    }
  };

  useEffect(() => {
    handleGetPurchaseHistory();
  }, [connected]);

  const handleGetSubscriptions = async () => {
    try {
      await getSubscriptions({ skus: subscriptionSkus });
    } catch (error) {
      errorLog({ message: "handleGetSubscriptions", error });
    }
  };

  useEffect(() => {
    handleGetSubscriptions();
  }, [connected]);

  useEffect(() => {
    // ... listen if connected, purchaseHistory and subscriptions exist
    if (
      purchaseHistory.find(
        (x) => x.productId === (subscriptionSkus[0] || subscriptionSkus[1]),
      )
    ) {
      navigation.navigate("Home");
    }
  }, [connected, purchaseHistory, subscriptions]);

  const handleBuySubscription = async (productId) => {
    try {
      await requestSubscription({
        sku: productId,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof PurchaseError) {
        errorLog({ message: `[${error.code}]: ${error.message}`, error });
      } else {
        errorLog({ message: "handleBuySubscription", error });
      }
    }
  };

  useEffect(() => {
    const checkCurrentPurchase = async (purchase) => {
      if (purchase) {
        try {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            if (Platform.OS === "ios") {
              const isTestEnvironment = __DEV__;

              //send receipt body to apple server to validete
              const appleReceiptResponse = await validateReceiptIos(
                {
                  "receipt-data": receipt,
                  password: ITUNES_SHARED_SECRET,
                },
                isTestEnvironment,
              );

              //if receipt is valid
              if (appleReceiptResponse) {
                const { status } = appleReceiptResponse;
                if (status) {
                  navigation.navigate("Home");
                }
              }

              return;
            }
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 28,
              textAlign: "center",
              paddingBottom: 15,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Subscribe
          </Text>
          <Text style={styles.listItem}>
            Subscribe to some cool stuff today.
          </Text>
          <Text
            style={
              (styles.listItem,
              {
                fontWeight: "500",
                textAlign: "center",
                marginTop: 10,
                fontSize: 18,
              })
            }
          >
            Choose your membership plan.
          </Text>
          <View style={{ marginTop: 10 }}>
            {subscriptions.map((subscription, index) => {
              const owned = purchaseHistory.find(
                (s) => s?.productId === subscription.productId,
              );
              console.log("subscriptions", subscription?.productId);
              return (
                <View style={styles.box} key={index}>
                  {subscription?.introductoryPriceSubscriptionPeriodIOS && (
                    <>
                      <Text style={styles.specialTag}>SPECIAL OFFER</Text>
                    </>
                  )}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        paddingBottom: 10,
                        fontWeight: "bold",
                        fontSize: 18,
                        textTransform: "uppercase",
                      }}
                    >
                      {subscription?.title}
                    </Text>
                    <Text
                      style={{
                        paddingBottom: 20,
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      {subscription?.localizedPrice}
                    </Text>
                  </View>
                  {subscription?.introductoryPriceSubscriptionPeriodIOS && (
                    <Text>
                      Free for 1{" "}
                      {subscription?.introductoryPriceSubscriptionPeriodIOS}
                    </Text>
                  )}
                  <Text style={{ paddingBottom: 20 }}>
                    {subscription?.description}
                  </Text>
                  {owned && (
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      You are Subscribed to this plan!
                    </Text>
                  )}
                  {owned && (
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#0071bc" }]}
                      onPress={() => {
                        navigation.navigate("Home");
                      }}
                    >
                      <Text style={styles.buttonText}>Continue to App</Text>
                    </TouchableOpacity>
                  )}
                  {loading && <ActivityIndicator size="large" />}
                  {!loading && !owned && isIos && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setLoading(true);
                        handleBuySubscription(subscription.productId);
                      }}
                    >
                      <Text style={styles.buttonText}>Subscribe</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    paddingLeft: 8,
    paddingBottom: 3,
    textAlign: "center",
    color: "black",
  },
  box: {
    margin: 10,
    marginBottom: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 7,
    shadowColor: "rgba(0, 0, 0, 0.45)",
    shadowOffset: { height: 16, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "mediumseagreen",
    borderRadius: 8,
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
  },
  specialTag: {
    color: "white",
    backgroundColor: "crimson",
    width: 125,
    padding: 4,
    fontWeight: "bold",
    fontSize: 12,
    borderRadius: 7,
    marginBottom: 2,
  },
});
```

> src/screens/Home.js

```js
import React from "react";

import {
  SafeAreaView,
  View,
  Image,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";

export const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to my app</Text>
      {/* <Image
        style={styles.image}
        source={require('../assets/trail-laguna.png')}
      /> */}

      <Text style={styles.paragraph}>
        Get access to 100s of delicious low calorie nutritious and easy to make
        recipes. Get daily updates and tips to eat healthy.
      </Text>
      <View style={styles.button}>
        <Pressable
        //navigate to some other paid content here.
        //onPress={() => navigation.navigate("Home")}
        >
          {({ pressed }) => (
            <Text style={styles.buttonText}>
              {pressed ? "Loading!" : "GET STARTED"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    width: "100%",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    paddingBottom: 15,
    color: "black",
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 16,
    paddingLeft: 8,
    paddingBottom: 3,
    textAlign: "center",
    color: "black",
    marginTop: 10,
  },
  button: {
    margin: 10,
    padding: 10,
    borderRadius: 7,
    alignSelf: "stretch",
    width: "auto",
    backgroundColor: "dodgerblue",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
  },
  image: { width: "100%", height: 258, resizeMode: "contain" },
});
```

Finally replace App.tsx with the following code.

```js
/**
 * React Native App Iap Example
 *
 * @format
 */
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { withIAPContext } from "react-native-iap";
import { createStackNavigator } from "@react-navigation/stack";

import { Home } from "./src/screens/Home";
import { Subscriptions } from "./src/screens/Subscriptions";

export const screens = [
  {
    name: "Subscriptions",
    title: "Subscriptions",
    component: withIAPContext(Subscriptions),
    section: "Context",
    color: "#cebf38",
  },
  {
    name: "Home",
    component: Home,
    section: "Context",
    color: "#cebf38",
  },
];

const Stack = createStackNavigator();

export const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ title: "MainlyPaleo Subscriptions" }}>
    {screens.map(({ name, component, title }) => (
      <Stack.Screen
        key={name}
        name={name}
        component={component}
        //hide the header on these screens
        options={{
          title: title,
          headerShown:
            name === "Home" || name === "Subscriptions" ? false : true,
        }}
      />
    ))}
  </Stack.Navigator>
);

function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default App;
```

Finally we need to add some code to configure the react-native-dotenv dependecy. Add the following code to your babel.config.js

```js
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
```

### 8. Test the in app purchase on your device.

Now we can run our app on our device using XCode. Connect the device you will be testing on and select it from the drop down in XCode. Run the build. This will start the app on your device.

To test the in app purchase with the sandbox tester you created above, you'll need to sign in with the sandbox user in your device settings. General->App Store and scroll down to Sandbox Users.

Common errors: Error in simulator with handleGetPurchase history is because you can't test on simulator or your apple id is not logged in to the device.

If you have found this useful, I hope you will consider enrolling in one of my [online courses on creating full-stack apps with react native](/courses).