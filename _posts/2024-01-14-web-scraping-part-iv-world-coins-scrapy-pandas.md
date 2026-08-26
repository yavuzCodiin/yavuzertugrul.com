---
title: "Web Scraping Series Part IV — World Coins with Scrapy & Data Analysis with Pandas"
date: 2024-01-14
type: post
topic: scraping
tags: [Scraping]
origin: medium
medium_url: https://levelup.gitconnected.com/web-scraping-series-part-iv-world-coins-with-scrapy-data-analysis-with-pandas-6222bb8d6aa7
image: /images/medium_images/World_Coins_with_Scrapy_&_Data_Analysis_with_Pandas.png
image_color: true
description: "Scrapy for the crawl, pandas for the analysis — antique coin data from collection to chart."
---

## Web Scraping Series Part IV — World Coins with Scrapy & Data Analysis with Pandas

As an enthusiastic collector of antique coins, I have always been fascinated by the rich history each piece embodies. These coins are not only currency, but also links to our past. Some may have been used in times of war, others for everyday transactions like buying food, book, clothes or acquiring a new home. Each coin holds a story, a glimpse into the lives and times of those who once held them.

My journey as a collector often takes me through antique bazaars, online marketplaces, and networks of fellow enthusiasts. It’s a pursuit that combines my love for history with the thrill of discovery. Among my collection, there are a few coins that stand out, not just for their historical significance, but for their art. More than just metal, these coins are miniature masterpieces, a showcase of the craftsmanship and artistic sensibilities of their time.

In each coin, I see the confluence of economy, art, and history. They are a reminder of the evolution of societies, the rise and fall of economies and the way art reflects the times. This collection is not just a hobby for me; it’s a journey through time, an exploration of the human story etched in metal.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-01.jpeg' | relative_url }}" alt="Antique coins — Photograph by author" loading="lazy">
  <figcaption>Antique coins — Photograph by author</figcaption>
</figure>

In the first three part I talked about **beautifulsoup, requests, html structure, selenium, browser automation, X, instagram and github scraping, **if you want to catch up I suggest to you to check them:

### Part I:

[Web Scraping Series Part I — IMDb’s Most Popular Movies with Requests and BeautifulSoup](https://levelup.gitconnected.com/web-scraping-series-part-i-imdbs-most-popular-movies-with-requests-and-beautifulsoup-19dfcc0f524a)

### Part II:

[Web Scraping Series Part II — X Feed & Selenium](https://levelup.gitconnected.com/web-scraping-series-part-ii-x-feed-selenium-c10ceb4b1a12)

### Part III:

[Web Scraping Series Part III— Practice with Instagram & GitHub](https://levelup.gitconnected.com/web-scraping-series-part-iii-practice-with-instagram-github-99359590198f)

One of the data scientist that I talked said:

> To become a better data scientist, you have to get your hands dirty, and you should get your own data, you should find data from your personal data(e.g. smart watches), get the data from the internet, clean that ugly data and turn it into meaningful stories. In this process you will tear a lot of hair, you will say it doesn’t work, I can’t do it, but in the end this is the way to learn.

In fourth installment I will combine, scraping the data from from Vcoins with tool called **Scrapy** and after that I will clean and try to analyze the data I obtain from there with **Pandas, **let’s start.

First of all I will use python virtual environment to compile my project and I will install all my necessary libraries and more to my virtual environment I suggest you to use it in your projects because sometimes version cause problem and also if you are going to try this project on Windows you need to configure some settings luckily I done it on Windows and I will first show you that.

## Virtual Environment

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-02.gif' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

### Pip Installation

```
python get-pip.py
```

### Add Python to Path

You need to find your python executable location to add it to Path generally you can find it under C:\Python it is going to look like this:

```
C:\Users\USER\AppData\Local\Programs\Python
```

then you need to add find Edit the system environment variables click on Environment Variables and add this path to there.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-03.png' | relative_url }}" alt="Edit the system environment variables — Screenshot by author" loading="lazy">
  <figcaption>Edit the system environment variables — Screenshot by author</figcaption>
</figure>

### Creating Virtual environment

```
python -m venv venv
```

When you create venv named virtual environment you will find Scripts folder in it and inside it there is file called activate this is batch file we will activate our environment with this

### Activating venv

```
venv\Scripts\activate
```

Now we are ready to use our virtual environment.

If you face with “**Execution_Policies” problem, **you can run the following script on powershell:

```
Set-ExecutionPolicy RemoteSigned
```

### Installing packages into venv

```
python -m pip install "package-name"
```

That’s it we can install **any package we want with any version we need without making our environment messier**, or dealing with issues problems because of all other modules in the same environment etc.

### Deactivating venv

```
deactivate
```

When we are done, we can simply close our virtual environment with deactivate.

You can check this documentation for more: [Virtual Environments and Packages](https://docs.python.org/3/tutorial/venv.html#)

Let’s install our packages:

```
pip install Scrapypip install pandaspip install numpy
```

## What is Scrapy?

Scrapy is a simply high-level web crawling and scraping framework that helps us to extract structured data from websites. It can be used for various purposes, including data mining, monitoring, and automated testing.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-04.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

Documentation => [Scrapy 2.11 documentation — Scrapy 2.11.0 documentation](https://docs.scrapy.org/en/latest/#)

### Starting Project

```
scrapy startproject "project_name"
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-05.png' | relative_url }}" alt="folder project_darphane(Mint Office) — Screenshot by author" loading="lazy">
  <figcaption>folder project_darphane(Mint Office) — Screenshot by author</figcaption>
</figure>

After we started our project, our folder has files like settings.py where you can configure your spider settings, items.py, pipelines.py etc. and the most important one is **spiders **folder we will configure our spider and it will do what we ask for we can create different spiders for different jobs. To begin with I suggest you to check the [documentation](https://docs.scrapy.org/en/latest/#)** **it really helps for you to understand what’s going on.

```
from pathlib import Pathimport scrapyclass QuotesSpider(scrapy.Spider):    name = "quotes"    def start_requests(self):        urls = [            "https://quotes.toscrape.com/page/1/",            "https://quotes.toscrape.com/page/2/",        ]        for url in urls:            yield scrapy.Request(url=url, callback=self.parse)    def parse(self, response):        page = response.url.split("/")[-2]        filename = f"quotes-{page}.html"        Path(filename).write_bytes(response.body)        self.log(f"Saved file {filename}")
```

You can find examples like this in the documentation, spider structure looks like this, the important thing is name must be unique you will use spider’s name to crawl data.

There is shortcut to start_requests method:

```
from pathlib import Pathimport scrapyclass QuotesSpider(scrapy.Spider):    name = "quotes"    start_urls = [        "https://quotes.toscrape.com/page/1/",        "https://quotes.toscrape.com/page/2/",    ]    def parse(self, response):        page = response.url.split("/")[-2]        filename = f"quotes-{page}.html"        Path(filename).write_bytes(response.body)
```

### Crawling with Scrapy

```
scrapy crawl quotes #quetos spider will get into actionscrapy crawl quotes -o quotes.json #with this you can save data into json format
```

### Crawling via Scrapy Shell

```
scrapy shell "url" #with this you can directly get the data to analyze in the shell
```

- from scrapy shell you can directly analyze to see output

```
response.css("title::text").get()# Output: 'Quotes to Scrape'
```

That’s it for now for more information you can check documentation I gave above it is enough for you to understand deeper.

## What is Pandas?

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-06.gif' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

Pandas is an open-source Python library that has changed the game in data analysis and manipulation. Think of pandas as **Swiss Army knife**. It’s **powerful** yet **user-friendly**, **complex **yet **approachable**, and it’s the tool for anyone looking to make sense of data.

At its core, pandas is designed to work with ‘**DataFrame**’ objects, which you can imagine as supercharged Excel spreadsheets that can hold a wide array of data types and are bound by rows and columns. With pandas, tasks like reading data from various sources, cleaning it to a usable format, exploring it to find trends, and even visualizing it for presentations are simplified.

Why pandas? Because it streamlines complex processes into **one or two lines of code **— processes that otherwise would have taken countless steps in traditional programming languages. It’s especially popular in academic research, finance, and commercial data analytics because of its ability to handle large datasets efficiently and intuitively.

### Installation

```
pip install pandas
```

### Example from pandas documentation

```
import pandas as pdimport numpy as npdf_exe = pd.DataFrame(    {        "One": 1.0,        "Time data": pd.Timestamp("20130102"),        "Series": pd.Series(1, index=list(range(4)), dtype="float32"),        "Numpy Array": np.array([3] * 4, dtype="int32"),        "Catalog": pd.Categorical(["Chair", "Tv", "Mirror", "Sofa"]),        "F": "example",    })df_exe
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-07.png' | relative_url }}" alt="Output of df_exe DataFrame — Screenshot by author" loading="lazy">
  <figcaption>Output of df_exe DataFrame — Screenshot by author</figcaption>
</figure>

```
df_exe[df_exe["Catalog"]=="Mirror"]
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-08.png' | relative_url }}" alt="Output of selecting specific row — Screenshot by author" loading="lazy">
  <figcaption>Output of selecting specific row — Screenshot by author</figcaption>
</figure>

We will explore more with the project so for now we are done with it for detailed information you can check [pandas documentation](https://pandas.pydata.org/docs/index.html).

## Project Vcoin

> Part 1: Getting the Data

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-09.png' | relative_url }}" alt="Vcoin — Screenshot by author" loading="lazy">
  <figcaption>Vcoin — Screenshot by author</figcaption>
</figure>

When I check the website I see the structure is like this and I decided to get the **seller name, money, **and **price **of it so I checked its html structure to see what to extract.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-10.png' | relative_url }}" alt="view page source — Screenshot by author" loading="lazy">
  <figcaption>view page source — Screenshot by author</figcaption>
</figure>

```
scrapy shell "https://www.vcoins.com/en/coins/world-1945.aspx"
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-11.png' | relative_url }}" alt="Scrapy shell — Screenshot by author" loading="lazy">
  <figcaption>Scrapy shell — Screenshot by author</figcaption>
</figure>

```
response.css("div.item-link a::text").extract()
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-12.png' | relative_url }}" alt="Seller — Screenshot by author" loading="lazy">
  <figcaption>Seller — Screenshot by author</figcaption>
</figure>

```
response.css("p.description a::text").extract()
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-13.png' | relative_url }}" alt="Money — Screenshot by author" loading="lazy">
  <figcaption>Money — Screenshot by author</figcaption>
</figure>

```
response.css("div.prices span.newitemsprice::text").extract()[::2]
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-14.png' | relative_url }}" alt="Price_Symbol — Screenshot by author" loading="lazy">
  <figcaption>Price_Symbol — Screenshot by author</figcaption>
</figure>

```
response.css("div.prices span.newitemsprice::text").extract()[1::2]
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-15.png' | relative_url }}" alt="Price— Screenshot by author" loading="lazy">
  <figcaption>Price— Screenshot by author</figcaption>
</figure>

These are data of one page, and I want my spider to search all the pages available and return the data so I will check pagination part on the bottom.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-16.png' | relative_url }}" alt="pagination — Screenshot by author" loading="lazy">
  <figcaption>pagination — Screenshot by author</figcaption>
</figure>

It will go until there is nothing.

I first done this project with getting text output, then for **csv(comma separated values)** output for data analysis. I won’t show code of text part but here is output.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-17.png' | relative_url }}" alt="Output data as .text — Screenshot by author" loading="lazy">
  <figcaption>Output data as .text — Screenshot by author</figcaption>
</figure>

**| Importing Libraries**

```
import scrapy  # Import the scrapy libraryimport csv  # Import the csv library
```

**| __init__**

```
# Define a new spider class which inherits from scrapy.Spider.class MoneySpider(scrapy.Spider):    name = "moneyspider_csv"    page_count = 0      money_count = 1     start_urls = ["https://www.vcoins.com/en/coins/world-1945.aspx"]
```

**| Start_request**

```
def start_requests(self):        self.file = open('money.csv', 'w', newline='', encoding='UTF-8')  # Open a new CSV file in write mode.        self.writer = csv.writer(self.file)  # Create a CSV writer object.        self.writer.writerow(['Count', 'Seller', 'Money', 'Price'])  # Write the header row in the CSV file.        return [scrapy.Request(url=url) for url in self.start_urls]  # Return a list of scrapy.Request objects for each URL.
```

**| parse**

```
# This method processes the response from each URL    def parse(self, response):        # Extract the names        money_names = response.css("div.item-link a::text").extract()        # Extract the years        money_years = response.css("p.description a::text").extract()        # Extract the currency symbols        money_symbols = response.css("div.prices span.newitemsprice::text").extract()[::2]        # Extract the prices        money_prices = response.css("div.prices span.newitemsprice::text").extract()[1::2]        # Combine the currency symbols and prices        combined_prices = [money_symbols[i] + money_prices[i] for i in range(len(money_prices))]
```

```
# Loop through the extracted items and write each to a row in the CSV file.        for i in range(len(money_names)):            self.writer.writerow([self.money_count, money_names[i], money_years[i], combined_prices[i]])            self.money_count += 1
```

```
# Extract the URL for the next page        next_page_url = response.css("div.pagination a::attr(href)").extract_first()        # If there is a URL for the next page, construct the full URL and continue scraping.        if next_page_url:            absolute_next_page_url = response.urljoin(next_page_url)            self.page_count += 1            if self.page_count != 10:                yield scrapy.Request(url=absolute_next_page_url, callback=self.parse, dont_filter=True)            else:                self.file.close()
```

**| Output**

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-18.png' | relative_url }}" alt="CSV output — Screenshot by author" loading="lazy">
  <figcaption>CSV output — Screenshot by author</figcaption>
</figure>

> Part 2: Data Analysis

We successfully extracted the csv data, now it is time for us to analyze.

```
import pandas as pdimport numpy as nptest = pd.read_csv("money.csv",index_col="Count")test
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-19.png' | relative_url }}" alt="Output as DataFrame — Screenshot by author" loading="lazy">
  <figcaption>Output as DataFrame — Screenshot by author</figcaption>
</figure>

```
test.shapetest.info()test.describe()
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-20.png' | relative_url }}" alt="Outputs of shape attribute, info and describe method — Screenshot by author" loading="lazy">
  <figcaption>Outputs of shape attribute, info and describe method — Screenshot by author</figcaption>
</figure>

```
test.isnull().sum()
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-21.png' | relative_url }}" alt="Output of NaN search — Screenshot by author" loading="lazy">
  <figcaption>Output of NaN search — Screenshot by author</figcaption>
</figure>

```
test.drop_duplicates().sort_values(by="Price",ascending=False).head(25)
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-22.png' | relative_url }}" alt="Output sorted via Price —screenshot by author" loading="lazy">
  <figcaption>Output sorted via Price —screenshot by author</figcaption>
</figure>

```
# Regular expression(Regex) pattern to match 2, 3, or 4 consecutive digits.pattern = r'(\b\d{4}\b|\b\d{3}\b|\b\d{2}\b)'test['Extracted_Year'] = test['Money'].str.extract(pattern, expand=False)test['Extracted_Year'] = pd.to_numeric(test['Extracted_Year'], errors='coerce').fillna(-1).astype(int)test.drop_duplicates().sort_values(by='Extracted_Year',ascending=False).head(60)
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-23.png' | relative_url }}" alt="Extracting the Year & Sorting by Year — Screenshot by author" loading="lazy">
  <figcaption>Extracting the Year & Sorting by Year — Screenshot by author</figcaption>
</figure>

```
def clean_price(price):    price = price.replace('US$', '').replace('€', '').replace('£', '').replace('NOK', '')    price = price.replace(',', '').replace('.', '')    price = price.strip()    return price# Apply the cleaning function to Price Columntest['Price'] = test['Price'].apply(clean_price)test['Price'] = pd.to_numeric(test['Price'], errors='coerce')test[["Money", "Price"]].drop_duplicates().sort_values(by="Price", ascending=False).head(40)
```

- This is not correct thing to do but I wanted to show you clean process I haven’t decide how to correctly sort my values because there are different currencies.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-24.png' | relative_url }}" alt="Cleaned Price Data — Screenshot by author" loading="lazy">
  <figcaption>Cleaned Price Data — Screenshot by author</figcaption>
</figure>

```
test[test["Money"].apply(lambda x : x.startswith("Elizabeth"))]test[test["Seller"].apply(lambda x : x.startswith("Sovereign"))]
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-25.png' | relative_url }}" alt="Search through Dataset — Screenshot by author" loading="lazy">
  <figcaption>Search through Dataset — Screenshot by author</figcaption>
</figure>

```
test[test["Money"].isin(["Elizabeth II 1966 Gillick Sovereign MS64"])]
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-iv-world-coins-scrapy-pandas-26.png' | relative_url }}" alt="Specific Search — Screenshot by author" loading="lazy">
  <figcaption>Specific Search — Screenshot by author</figcaption>
</figure>

Thank you for taking the time to read through this piece. I’m glad to share these insights and hope they’ve been informative. If you enjoyed this article and are looking forward to more content like this, feel free to stay connected by following my Medium profile. Your support is greatly appreciated. Until the next article, take care and stay safe!

Connect with me across the web, you can explore my digital world through the link below, including more articles, projects, and personal interests, check out.

[yavuzertugrul | Twitter, Instagram | Linktree](https://linktr.ee/yavuzertugrul?utm_source=linktree_profile_share<sid=06fba266-ed7b-4e66-8241-84c67a637a88)

[Web Scraping Series Part IV — World Coins with Scrapy & Data Analysis with Pandas](https://levelup.gitconnected.com/web-scraping-series-part-iv-world-coins-with-scrapy-data-analysis-with-pandas-6222bb8d6aa7) was originally published in [Level Up Coding](https://levelup.gitconnected.com) on Medium, where people are continuing the conversation by highlighting and responding to this story.
