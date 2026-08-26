---
title: "Currency Converter App with APILayer's Fixer API and PyQt Framework"
date: 2023-12-19
type: post
topic: scraping
tags: [Python]
origin: medium
medium_url: https://levelup.gitconnected.com/currency-converter-app-with-apilayers-fixer-api-and-pyqt-framework-43b2e4292d09
image: /images/medium_images/currency_converter_app.png
image_color: true
description: "A desktop currency converter on APILayer's Fixer API, with a PyQt front end."
---

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-01.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

Have you ever found yourself in need of a quick currency conversion, maybe while planning a vacation or during an international online shopping spree? Currency converter application will be there for you.

Hi there, I’m welcoming you from another post in my learning journey. I want start with saying thank you to all developers around you are making life easier. My latest project? A handy currency converter app.

Building this app was like putting together a puzzle, where each piece was a new learning experience, every step was a journey. And the best part? I combined my passion for coding with real-world application.

In the following paragraphs, I’ll share how I created this app. From the initial idea to the final product, it was fun, I hope you will also like it.

## What is Json?

JSON, short for **JavaScript Object Notation**, is something I often encounter and work with in my programming projects. It’s a format for storing and transporting data, and I find it incredibly handy. Why? Because JSON structures data in a way that’s both easy for us humans to read and write, and easy for machines to parse and generate.

To me, **JSON** is like the digital equivalent of a well-organized filing cabinet. Each piece of data is stored in a structured format, quite similar to a **dictionary**. It has **keys **(like labels on a file) and **values **(the contents of the file). For instance, in a JSON file storing user information, ‘name’ would be a key, and ‘John Doe’ could be its corresponding value. For example let’s see who is John Doe:

*{*

*“Name”: “John”,*

*“Surname”: “Doe”,*

*“Phone_Number” :3454543,*

*“Features”: {
 “hobby”: “playing games”,*

*“job”: “Instructor”*

*}*

*}*

Let’s say I’m using an API to fetch some data. More often than not, this data comes in JSON format. I can easily access this information, thanks to the structured format of JSON. If I want to find a user’s name, I simply look up the value associated with the key ‘name’. It’s this straightforward nature that makes JSON a go-to choice for developers.

Now, regarding [Fixer.io](http://fixer.io/), it’s a handy tool for anyone needing currency conversion data. The free version of [Fixer.io](http://fixer.io/) provides essential functionalities, like real-time exchange rates and historical data for a limited number of currencies. It’s perfect for new learners, small projects or personal use where basic currency conversion data is sufficient.

However, the free version does come with its limitations. For instance, there’s a cap on the number of **monthly API** calls with **1000**, and the data might not be as frequently updated as in the paid versions it is updated **hourly**. The premium plans, on the other hand, offer more features, like more currencies, more frequent updates, and additional data points like fluctuation information. These advanced features are particularly useful for businesses or applications that require more detailed financial data and higher request volumes.

Accessing and using the [Fixer.io](http://fixer.io/) API is pretty straightforward. They provide clear [documentation](https://fixer.io/documentation), and since the API returns data in JSON format, it’s easy to integrate into most web projects. The simplicity of JSON really shines here, as I can quickly parse the data and use it as needed in my application.

> Note: For the most current and detailed information about Fixer.io’s offerings and the specific differences between their free and premium plans, I recommend checking their official website or contacting their support team, as the features and limitations can change over time.

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-02.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

## What is API?

Whenever I dive into the world of development, another term that constantly pops up is **‘API’**, which stands for **Application Programming Interface**. But what does that really mean? Well, I like to think of an API as a menu in a restaurant. It’s a list of ‘dishes’ — or in this case, services and data — that a software program offers. Just like how I’d order a meal, my software requests specific information or services from another application or server using its API.

For me, the real magic of APIs lies in their ability to bridge the gap between different software systems. They’re like a **common language** that lets my applications talk to each other, exchange information, and even make requests. This communication is crucial, especially in today’s interconnected digital world where different applications need to work together seamlessly.

One aspect of APIs that makes my life easier is their abstraction. They hide all the **complex**, nitty-gritty details of their internal workings. It’s similar to driving a car; I don’t need to know every mechanical detail under the hood. I just need to know how to use the steering wheel, accelerator, and brakes. APIs work the same way — I use the ‘controls’ they provide without worrying about how they do what they do.

## What is REST API?

REST, which stands for **Representational State Transfer**, is like a set of guidelines for creating smooth, efficient online conversations. It’s all about simplicity and using familiar web standards. For instance, when my application needs to fetch data, it uses a REST API through a straightforward HTTP request, much like how we browse websites.

The real beauty of REST APIs lies in their approach to handling resources, like the data or services offered by a server. They use simple URLs for these resources, and four basic actions — think of them as the web’s equivalent of create, read, update, and delete. This makes them incredibly intuitive. I use GET to grab data, POST to add something new, PUT to update it, and DELETE to, well, delete it.

Now, let’s talk about [Fixer API](http://fixer.io/). It’s a classic example of a REST API in action. It offers real-time exchange rates provided by the European Central Bank. The way it’s structured and the methods it uses for data retrieval and manipulation are REST. It’s streamlined and user-friendly, allowing me to interact with it using straightforward HTTP requests.

## How to Use API?

First of all, let’s go over the documentation together on how to use this API

[Documentation site](https://fixer.io/documentation) has all we need so first you need to sign up and get **API KEY** which is crucial for us to use the service.

[data.fixer.io/api/latest?access_key=](http://data.fixer.io/api/latest?access_key=2c0ec96ab61399c54904f4b267b02427){**your API key is going here**} with running API Requst we get these dictionary like output:

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-03.png' | relative_url }}" alt="JSON Output of API Request — Screenshot by author" loading="lazy">
  <figcaption>JSON Output of API Request — Screenshot by author</figcaption>
</figure>

So we will use these to create our convert currency app. In the following, we have error codes in case you get error check here.

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-04.png' | relative_url }}" alt="Error Codes of Fixer API — Screenshot by author" loading="lazy">
  <figcaption>Error Codes of Fixer API — Screenshot by author</figcaption>
</figure>

We need 3 parameters to do conversion it is not required in API request but we need it for our application to get conversion rate.

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-05.png' | relative_url }}" alt="Request Parameters Fixer API — Screenshot by author" loading="lazy">
  <figcaption>Request Parameters Fixer API — Screenshot by author</figcaption>
</figure>

> Endpoint URLs

[http://data.fixer.io/api/latest?access_key={YOUR_ACCESS_KEY}&base={base](http://data.fixer.io/api/latest?access_key={YOUR_ACCESS_KEY}&base={base)** currency**}&symbols={**target currency**}

For more detail I recommend you to check their documentation I am putting the links you can use: [Quickstart Guide](https://fixer.io/quickstart), [API Documentation](https://fixer.io/documentation)**, **[Usage Statistics](https://fixer.io/usage)

## What is Qt and PyQt5 ?

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-06.png' | relative_url }}" alt="Currency Converter App — Screenshot by author" loading="lazy">
  <figcaption>Currency Converter App — Screenshot by author</figcaption>
</figure>

Let’s take a trip to an amusement park to understand what PyQt and PyQt5 are all about. Think of Qt as amusement park filled with various exciting rides and attractions. These rides represent different tools you can use to build applications. However, there’s a catch: all the instructions for the rides are in a language that’s quite complex to understand (e.g this language being C++).

Now, imagine if you had a special guidebook that translated all these instructions into a language you’re comfortable with. This guidebook is PyQt. It translates world of Qt into Python, a language known for its simplicity and ease of use.

PyQt5 is one of the latest edition of this guidebook. It’s updated with the newest rides and attractions. Using PyQt5, I can easily choose and enjoy the most advanced features in the Qt amusement park, but with the simplicity and comfort of Python. Whether I want build complex application or create a simple app, PyQt5 makes the experience straightforward and fun.

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-07.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

If you are just starting out, PyQt5 is an invaluable resource. It allows you to explore the vast possibilities of software development in a user-friendly environment.

## COMPLETE CODE

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-08.jpg' | relative_url }}" alt="Designing and stuff — Screenshot by author" loading="lazy">
  <figcaption>Designing and stuff — Screenshot by author</figcaption>
</figure>

> Importing and Initiating

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-09.png' | relative_url }}" alt="Designing GUI with QtDesigner — Screenshot by author" loading="lazy">
  <figcaption>Designing GUI with QtDesigner — Screenshot by author</figcaption>
</figure>

In this part, I’m loading the GUI, tailoring the app window, initializing variables for both currency conversion and the GUI, and enhancing user interaction within the app.

```
import sysimport timeimport requestsfrom PyQt5 import QtWidgets, uicfrom PyQt5.QtWidgets import QMessageBoxclass MainWindow(QtWidgets.QMainWindow):    def __init__(self, parent=None):        super().__init__(parent)        uic.loadUi('currency_converter.ui', self) # This will load ui which we created with QtDesigner        self.setWindowTitle("Currency Converter App")        self.setFixedSize(703, 503)        # Initialize currency rate        self.rate = None        #Defining Variables on the GUI        self.base_currency = self.findChild(QtWidgets.QComboBox, 'base_comboBox')        self.target_currency = self.findChild(QtWidgets.QComboBox, 'target_comboBox')        self.base_value = self.findChild(QtWidgets.QLineEdit, 'basevalue_lineEdit')        self.target_value = self.findChild(QtWidgets.QLineEdit, 'targetvalue_lineEdit')        self.rate_currency = self.findChild(QtWidgets.QLineEdit,'currencyrate_lineEdit')        #Operations        self.base_currency.currentIndexChanged.connect(self.currency_changed)        self.target_currency.currentIndexChanged.connect(self.currency_changed)        self.base_value.editingFinished.connect(self.update_conversion_rate)        time.sleep(4)        self.base_value.editingFinished.connect(self.convert_currency)
```

> Updating Conversion Rate

In this part of the code for currency converter app, I’m handling the crucial task of **updating the conversion rate**. First, I define my API key for accessing the currency data. Then, I fetch the selected currencies from the combo boxes in the GUI, which are the base and target currencies for conversion.

Next, I construct the URL for the API request, dynamically inserting the chosen **base** and **target **currencies along with my **API key**. The request is sent using requests.get, and the response, in **JSON format**, is stored.

I then extract the **conversion rate** from this **response**. If the API call is successful, the app updates the conversion rate. In case the rate is unavailable, or the target currency is not supported, the app shows an error message. Additionally, if there’s any other type of API error, like incorrect parameters or server issues, the app displays the specific error details.

This code is vital for keeping the app’s data current, ensuring that users always get the latest conversion rates based on their selected currencies.

```
def update_conversion_rate(self):        api_key = "YOUR API KEY GOES HERE"        base_index = self.base_currency.currentIndex()        self.base_text = self.base_currency.itemText(base_index)                target_index = self.target_currency.currentIndex()        self.target_text = self.target_currency.itemText(target_index)        if self.base_text and self.target_text:            url ="http://data.fixer.io/api/latest?access_key={}&symbols={}&base={}".format(api_key, self.target_text, self.base_text)            response = requests.get(url)            self.data = response.json()            if self.data["success"]:                self.rate = self.data['rates']["{}".format(self.target_text)]                self.rate_currency.setText("{:.2f}".format(self.rate))                if self.rate is None:                    QMessageBox.critical(self, "API Error", f"Target currency {self.target_text} is not supported.")            else:                self.rate = None                error_info = self.data.get('error', {})                QMessageBox.critical(self, "API Error", f"Error {error_info.get('code')}: {error_info.get('info')}")        else:            QMessageBox.critical("Select Currencies you want to do conversion")
```

> Converting the Currency

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-10.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

The **currency_changed()** function is straightforward. Whenever a user selects a **different** base or target currency, this function clears the input and output on the GUI. This reset ensures that old values don’t interfere with new calculations when the currency selection changes.

The **convert_currency()** function is where the core action happens. It kicks in when there’s a need to convert an amount from the base currency to the target currency. First, it checks if the conversion rate **(self.rate)** is available.

If it is, the function attempts to convert the entered amount (grabbed from base_value) using this rate. The result is displayed on the GUI. To handle scenarios where the user might enter invalid data (like text instead of numbers), I’ve included a try-except block. If the input isn’t a valid number, the app shows a warning and clears the output field.

There’s also a provision for cases where the conversion rate might not be available — maybe due to an issue with the API or an unsupported currency. In such cases, the app alerts the user and clears both input and output fields, readying the app for another attempt once the issue is resolved.

Overall, these functions ensure my app is responsive, accurate, and user-friendly, providing a seamless experience in currency conversion.

```
def currency_changed(self):        self.base_value.clear()        self.target_value.clear()    def convert_currency(self):        # Check if rate is available        if self.rate is not None:            try:                amount = float(self.base_value.text())                converted_amount = self.rate * amount                self.target_value.setText("{:.2f}".format(converted_amount))            except ValueError:                QMessageBox.warning(self, "Input Error", "Please enter a valid amount.")                self.target_value.clear()        else:            QMessageBox.warning(self, "Conversion Error", "Conversion rate not available. Please check the base currency and try again.")            self.base_value.clear()            self.target_value.clear()
```

> Main Part

This part is also straightforward, it is starting the application and opening the application.

```
if __name__ == '__main__':    app = QtWidgets.QApplication(sys.argv)    window = MainWindow()    window.show()    sys.exit(app.exec_())
```

<figure>
  <img src="{{ '/images/medium_posts/currency-converter-app-fixer-api-pyqt-11.png' | relative_url }}" alt="Currency Converter App — Screenshot by author" loading="lazy">
  <figcaption>Currency Converter App — Screenshot by author</figcaption>
</figure>

Thank you for taking the time to read through this piece. I’m glad to share these insights and hope they’ve been informative. If you enjoyed this article and are looking forward to more content like this, feel free to stay connected by following my Medium profile. Your support is greatly appreciated. Until the next article, take care and stay safe! For all my links in one place, including more articles, projects, and personal interests, check out.

[yavuzertugrul | Twitter, Instagram | Linktree](https://linktr.ee/yavuzertugrul)

[Currency Converter App with APILayer’s Fixer API and PyQt Framework](https://levelup.gitconnected.com/currency-converter-app-with-apilayers-fixer-api-and-pyqt-framework-43b2e4292d09) was originally published in [Level Up Coding](https://levelup.gitconnected.com) on Medium, where people are continuing the conversation by highlighting and responding to this story.
