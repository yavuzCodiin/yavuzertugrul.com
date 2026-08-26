---
title: "Web Scraping Series Part I — IMDb's Most Popular Movies with Requests and BeautifulSoup"
date: 2024-01-04
type: post
topic: scraping
tags: [Scraping]
origin: medium
medium_url: https://levelup.gitconnected.com/web-scraping-series-part-i-imdbs-most-popular-movies-with-requests-and-beautifulsoup-19dfcc0f524a
image: /images/medium_images/BeautifulSoup_imdb.png
image_color: true
description: "Scraping IMDb's most popular movies with requests and BeautifulSoup — the series starts with static pages."
---

## Web Scraping Series Part I — IMDb’s Most Popular Movies with Requests and BeautifulSoup

So, if you ask me about the most important skill of this century, I would definitely tell you it’s data literacy. Understanding data is crucial because when you manage to comprehend and make it meaningful, that’s where you stand out.

We can manipulate data to suit our interests. I really enjoy watching movies, and the genre doesn’t matter much to me; if I like a movie, I’ll watch it. So, it’s not too hard for me to choose. However, if you’re solely an action movie fan, you probably don’t want to spend time on too many romantic or calm movies, right? For instance, if you want to watch a movie but are unsure which one to pick, we can scrape data to analyze it by title, genre, duration, release year, description, and so on. Then, we can easily make a decision.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-i-imdb-requests-beautifulsoup-01.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

Today I will talk about scraping the IMDB’s “[Most Popular Movies](https://www.imdb.com/chart/moviemeter)” data by using **requests**, and **BeautifulSoup** modules so let’s start by analyzing what are these two modules:

## Requests

The Python **requests **module is a powerful yet simple tool for sending HTTP requests. It allows you to send all kinds of HTTP requests without the need to manually add query strings to your URLs or to form-encode your POST data.

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-i-imdb-requests-beautifulsoup-02.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

## BeautifulSoup (HTML parser)

**BeautifulSoup** is a Python library that makes it easy to scrape information from web pages. It turns complicated HTML and XML files into something that’s simple to work with in Python. You can easily find and work with specific parts of a web page, like text, links, or tags, using BeautifulSoup. It’s great for both beginners and experienced programmers who need to gather data from the internet quickly and easily. In short, it’s like a helpful tool that takes the hard work out of reading and using the content of web pages.

For example, let me give you one example about how we can scrape. So with the following lines of code, we can scrape [https://www.reddit.com/](https://www.reddit.com/) ‘s main page and I only want to extract hyperlinks from this page and the result is:

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-i-imdb-requests-beautifulsoup-03.png' | relative_url }}" alt="Code and Output of Scraping Reddit — Screenshot by author" loading="lazy">
  <figcaption>Code and Output of Scraping Reddit — Screenshot by author</figcaption>
</figure>

If we want to extract the data, first we need to know the basics of html to scrape what we want:

**Page Structure:**

- : Declares the document type.
- : The root element.
- : Contains meta-information about the document.
- : Specifies the title shown in the browser's title bar or tab.
- : Contains the visible page content.

```
      Title        

## Heading

    Paragraph.

  
```

**Links: **Links are created with <a> tag and **href **attribute specifies the link’s destination

```
[Visit Example.com](https://example.com)
```

**Parameter:** Parameters, often referred to as attributes, provide additional information about HTML elements. For instance, in the link example, **href** is a parameter.

**Tables: **Tables are defined with <table>, with rows (<tr>) and cells (<td> for data or <th> for headers).

```
      Header 1    Header 2        Data 1    Data 2  
```

So this is the basic html structure, for more detailed structure you need to analyze for yourself, most of the page are dynamic which makes our job harder. BeautifulSoup is great for scraping static content but for dynamic pages we need little help from other tools.

## Web Scraping — IMDB’s “Most Popular Movies”

> Importing libraries

```
import requestsfrom bs4 import BeautifulSoup
```

> Function to fetch movie data from a given URL using BeautifulSoup

```
def fetch_movies(url, headers):    # Send a GET request to the URL with specified headers    response = requests.get(url, headers=headers)    # Parse the response content using BeautifulSoup    soup = BeautifulSoup(response.content, "html.parser")    return soup
```

> Function to extract movie names and ratings from the parsed HTML content

If I need to find the name, I check the page structure and find how it is stored then I can scrape it, so here is how we can find it:

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-i-imdb-requests-beautifulsoup-04.png' | relative_url }}" alt="Inspect the page — Screenshot by author" loading="lazy">
  <figcaption>Inspect the page — Screenshot by author</figcaption>
</figure>

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-i-imdb-requests-beautifulsoup-05.png' | relative_url }}" alt="Inspect the page — Screenshot by author" loading="lazy">
  <figcaption>Inspect the page — Screenshot by author</figcaption>
</figure>

```
def extract_movie_data(soup):    movie_data = []    # Find all movie names within 'h3' tags with a specific class    movie_names = soup.find_all('h3', class_='ipc-title__text')    # Find all movie ratings within 'span' tags with a specific class    movie_ratings = soup.find_all('span', class_='ipc-rating-star ipc-rating-star--base ipc-rating-star--imdb sc-9ab53865-1 iXEijC ratingGroup--imdb-rating')         # Loop through each name and rating, extract and store them    for name, rating in zip(movie_names, movie_ratings):        movie_name = name.text.strip()        movie_rating_str = rating.text.split()[0]                # Convert rating to float and append to movie data; handle conversion errors        try:            movie_rating = float(movie_rating_str)            movie_data.append((movie_name, movie_rating))        except ValueError:            print(f"Could not convert rating '{movie_rating_str}' for movie '{movie_name}' to a float.")        return movie_data
```

> Function to print sorted movie data based on a minimum rating threshold

```
def print_sorted_movies(movies, min_rating):    # Sort the movies by rating in ascending order    sorted_movies = sorted(movies, key=lambda x: x[1], reverse=False)    # Filter and print movies that meet or exceed the minimum rating    for movie in sorted_movies:        if movie[1] >= min_rating:            print(f"Movie Name: {movie[0]}, Rating: {movie[1]}")
```

> Main Program Execution

```
url = "https://www.imdb.com/chart/moviemeter"# Headers to mimic a browser request for bypassing potential access restrictionsheaders = {    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}# Fetch and parse the HTML content from the given URLsoup = fetch_movies(url, headers)# Extract movie data from the parsed HTML contentmovies = extract_movie_data(soup)# Get user input for minimum rating and print movies that meet this criterionmin_rating = float(input("Enter the minimum rating (e.g., 7.5): "))print_sorted_movies(movies, min_rating)}
```

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-i-imdb-requests-beautifulsoup-06.png' | relative_url }}" alt="Filtering the movies we scraped — Screenshot by author" loading="lazy">
  <figcaption>Filtering the movies we scraped — Screenshot by author</figcaption>
</figure>

<figure>
  <img src="{{ '/images/medium_posts/web-scraping-part-i-imdb-requests-beautifulsoup-07.png' | relative_url }}" alt="Filtering the movies we scraped — Screenshot by author" loading="lazy">
  <figcaption>Filtering the movies we scraped — Screenshot by author</figcaption>
</figure>

## The Complete Code

```
import requestsfrom bs4 import BeautifulSoupdef fetch_movies(url, headers):    response = requests.get(url, headers=headers)    soup = BeautifulSoup(response.content, "html.parser")    return soupdef extract_movie_data(soup):    movie_data = []    movie_names = soup.find_all('h3', class_='ipc-title__text')    movie_ratings = soup.find_all('span', class_='ipc-rating-star ipc-rating-star--base ipc-rating-star--imdb sc-9ab53865-1 iXEijC ratingGroup--imdb-rating')         for name, rating in zip(movie_names, movie_ratings):        movie_name = name.text.strip()        movie_rating_str = rating.text.split()[0]                try:            movie_rating = float(movie_rating_str)            movie_data.append((movie_name, movie_rating))        except ValueError:            print(f"Could not convert rating '{movie_rating_str}' for movie '{movie_name}' to a float.")        return movie_datadef print_sorted_movies(movies, min_rating):    # Sort the movies by rating in ascending order    sorted_movies = sorted(movies, key=lambda x: x[1], reverse=False)    # Filter and print movies based on minimum rating    for movie in sorted_movies:        if movie[1] >= min_rating:            print(f"Movie Name: {movie[0]}, Rating: {movie[1]}")# Main programurl = "https://www.imdb.com/chart/moviemeter"headers = {    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}soup = fetch_movies(url, headers)movies = extract_movie_data(soup)# Get user input for minimum ratingmin_rating = float(input("Enter the minimum rating (e.g., 7.5): "))print_sorted_movies(movies, min_rating)
```

Thank you for taking the time to read through this piece. I’m glad to share these insights and hope they’ve been informative. If you enjoyed this article and are looking forward to more content like this, feel free to stay connected by following my Medium profile. Your support is greatly appreciated. Until the next article, take care and stay safe! For all my links in one place, including more articles, projects, and personal interests, check out.

[yavuzertugrul | Twitter, Instagram | Linktree](https://linktr.ee/yavuzertugrul?utm_source=linktree_profile_share<sid=61298622-5c0b-4978-8520-bb12b9a718d0)

[Web Scraping Series Part I — IMDb’s Most Popular Movies with Requests and BeautifulSoup](https://levelup.gitconnected.com/web-scraping-series-part-i-imdbs-most-popular-movies-with-requests-and-beautifulsoup-19dfcc0f524a) was originally published in [Level Up Coding](https://levelup.gitconnected.com) on Medium, where people are continuing the conversation by highlighting and responding to this story.
