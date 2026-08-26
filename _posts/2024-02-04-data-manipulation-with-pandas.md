---
title: "Data Manipulation with Pandas"
date: 2024-02-04
type: post
topic: scraping
tags: [Scraping]
origin: medium
medium_url: https://levelup.gitconnected.com/data-manipulation-with-pandas-d1be327c1096
image: /images/medium_images/data_manipulation_w_pandas.png
image_color: true
description: "Selecting, filtering, grouping and reshaping — the pandas operations that carry most day-to-day analysis."
---

In today’s world, there’s a resource more important than oil, with the power to shape the future at our fingertips — data. This invaluable asset unlocks the potential to decode human behavior, innovate autonomous vehicles, and pioneer advanced robotics. The principle is straightforward: the more data we harness, the more intelligent our systems become.

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-01.gif' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

## What is DataFrame?

A DataFrame is essentially a table, much like the ones you’d see in Excel. It’s a way to store and organize your data, with rows and columns clearly laid out. Each column in a DataFrame represents a specific variable, and each row contains a set of values corresponding to those variables, much like a record.

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-02.png' | relative_url }}" alt="DataFrame Example — Unless otherwise stated, the screenshots are provided by the author and this applies to the remaining images as well." loading="lazy">
  <figcaption>DataFrame Example — Unless otherwise stated, the screenshots are provided by the author and this applies to the remaining images as well.</figcaption>
</figure>

One of the best parts about DataFrames, especially in Python’s Pandas library, is their flexibility. You can easily add, remove, or modify data. It’s like having a powerful spreadsheet in your code, allowing you to handle complex data tasks with just a few lines of code.

I explained Pandas and did some analysis using it, you can find more information from my other post below.

[Web Scraping Series Part IV — World Coins with Scrapy & Data Analysis with Pandas](https://levelup.gitconnected.com/web-scraping-series-part-iv-world-coins-with-scrapy-data-analysis-with-pandas-6222bb8d6aa7)

> — — — — — — Transforming DataFrames — — — — — —

## Some Methods and Attributes

### head() & tail():

These functions show the first and last five rows by default, offering a quick glimpse of your data. For a deeper look, adjust the parameters to see more rows, making it easy to get a sense of your dataset without examining every detail.

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-03.png' | relative_url }}" alt="head & tail method" loading="lazy">
  <figcaption>head & tail method</figcaption>
</figure>

### info():

This method provides quick summary of dataset, including number of entries, columns, the data type of each column, and the amount of memory used.

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-04.png' | relative_url }}" alt="info method — Screenshot by author" loading="lazy">
  <figcaption>info method — Screenshot by author</figcaption>
</figure>

### describe():

Provides summary of central tendencies, shape, statistics like mean, median, min, max, standard deviation and quartiles for each numeric column in dataset

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-05.png' | relative_url }}" alt="describe method" loading="lazy">
  <figcaption>describe method</figcaption>
</figure>

### shape, values, columns, index:

- **shape**: To see number of rows and columns.
- **values**: Provides a NumPy representation of the data, converting it into an array.
- **columns**: Names of the columns.
- **index**: Gives the index (row labels).

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-06.png' | relative_url }}" alt="shape, values, columns, index attributes" loading="lazy">
  <figcaption>shape, values, columns, index attributes</figcaption>
</figure>

## Sorting & Subsetting

### Sorting

So you can sort values by giving column name and you can choose the order by giving True or False to ascending, by default ascending is True so if you want to order from highest to lowest you should set ascending to False.

```
df.sort_values(by=["Menu_Price"], ascending=False)
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-07.png' | relative_url }}" alt="Sorting menu prices from highest to lowest" loading="lazy">
  <figcaption>Sorting menu prices from highest to lowest</figcaption>
</figure>

### Subsetting

We can do this by one column, condition or more.

```
df[df["Reviews"]>80]
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-08.png' | relative_url }}" alt="Subsetting reviews higher than 80" loading="lazy">
  <figcaption>Subsetting reviews higher than 80</figcaption>
</figure>

```
df[ (df["Menu_Price"]We can also subset by using isin()

```
df[df["Cuisine_Type"].isin(["Italian","American"])]
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-10.png' | relative_url }}" alt="Subsetting Italian and American cuisines" loading="lazy">
  <figcaption>Subsetting Italian and American cuisines</figcaption>
</figure>

## Adding Data to DataFrame

If you want to divide two list you get TypeError. Pandas series object which is pandas.core.series.Series also built on top of NumPy arrays, we can do division, multiplication etc. So by using two column I want to create another. By using Monthly_Revenue and Number_of_Customers columns I want to create Monthly_Revenue_pps

```
df["Monthly_Revenue_pps"] = df["Monthly_Revenue"] / df["Number_of_Customers"]
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-11.png' | relative_url }}" alt="Adding Monthly_Revenue_pps column" loading="lazy">
  <figcaption>Adding Monthly_Revenue_pps column</figcaption>
</figure>

> — — — — Aggregating DataFrames — — — —

## Summarizing Numerical Data

So we saw that by using describe method we can summarize our data generally. If we want to do it on specific part of the data we can use them individually or by grouping them.

median, mode, min, max, var, std, sum these methods can be used individually on dataset.

```
print("Mean:{}\nMedian:{}\nMin:{}\nMax:{}\n".format(df["Monthly_Revenue"].mean(),df["Monthly_Revenue"].median(),df["Monthly_Revenue"].min(),df["Monthly_Revenue"].max()))
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-12.png' | relative_url }}" alt="mean,median,min,max on Monthly Revenue" loading="lazy">
  <figcaption>mean,median,min,max on Monthly Revenue</figcaption>
</figure>

## Counting

To visualize the distribution, count the occurrences of values within the relevant column. For example, let’s see **Cuisine_Type’s** distribution.

```
df["Cuisine_Type"].value_counts()
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-13.png' | relative_url }}" alt="Figure" loading="lazy">
</figure>

## Grouped Summary Statistics

In descriptive statistics, summary statistics are used to summarize a set of observations so we can also apply it to our dataset.

```
df.groupby("Cuisine_Type")["Monthly_Revenue"].agg(["min","max","sum"])
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-14.png' | relative_url }}" alt="Monthly Revenue for each cuisine type" loading="lazy">
  <figcaption>Monthly Revenue for each cuisine type</figcaption>
</figure>

We can increase group numbers or summary numbers let’s see:

```
df.groupby(["Cuisine_Type","Menu_Price"])[["Reviews","Monthly_Revenue"]].mean()
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-15.png' | relative_url }}" alt="Monthly Revenue and Reviews for each Cuisine Type and Menu Price" loading="lazy">
  <figcaption>Monthly Revenue and Reviews for each Cuisine Type and Menu Price</figcaption>
</figure>

## Pivot Table

With the column, index and data we select, we can create pivot table to see more specific data together.

```
df.pivot_table(values="Monthly_Revenue", columns="Cuisine_Type")
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-16.png' | relative_url }}" alt="Pivot Table" loading="lazy">
  <figcaption>Pivot Table</figcaption>
</figure>

> — — — — Slicing & Indexing DataFrames— — — —

## Indexing

We can use indexing when we want to select specific rows or columns.

### label-based indexing ( loc[ ] )

```
grouped_df = df.groupby(["Cuisine_Type","Menu_Price"])[["Monthly_Revenue"]].mean()grouped_df.loc["American"]
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-17.png' | relative_url }}" alt="loc[]" loading="lazy">
  <figcaption>loc[]</figcaption>
</figure>

### integer-based indexing ( iloc[ ] )

```
df.iloc[1]
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-18.png' | relative_url }}" alt="iloc[]" loading="lazy">
  <figcaption>iloc[]</figcaption>
</figure>

## Slicing

We can use slicing when we want to select a subset of rows or columns.

```
df.loc[(df['Menu_Price'] > 46) & (df['Cuisine_Type'] == "Italian")]
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-19.png' | relative_url }}" alt="selecting sliced part with loc[]" loading="lazy">
  <figcaption>selecting sliced part with loc[]</figcaption>
</figure>

> — — Creating and Visualizing DataFrames — —

There are lots of ways to visualize our data, to tell the stories within them, we can use line, scatter, bar etc. but today I will show you some of them, which I used for this dataset.

But I suggest you to check examples from these two links for your needs.

- [Plot types - Matplotlib 3.10.8 documentation](https://matplotlib.org/stable/plot_types/index.html)
- [Example gallery - seaborn 0.13.2 documentation](https://seaborn.pydata.org/examples/index.html)

> Monthly Revenue — Bar Plot

```
fig = plt.figure(figsize =(10, 6))plt.hist(df["Monthly_Revenue"],bins=5,alpha=0.5)plt.show()
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-20.png' | relative_url }}" alt="Monthly Revenue Bar Plot" loading="lazy">
  <figcaption>Monthly Revenue Bar Plot</figcaption>
</figure>

> Average Customer Spending by Cuisine Type — Box Plot

```
plt.figure(figsize=(10,6))sns.boxplot(x='Cuisine_Type', y='Average_Customer_Spending', data=df, notch=True, palette="husl")plt.title('Average Customer Spending by Cuisine Type')plt.show()
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-21.png' | relative_url }}" alt="Average Customer Spending by Cuisine Type Box Plot" loading="lazy">
  <figcaption>Average Customer Spending by Cuisine Type Box Plot</figcaption>
</figure>

> Monthly Revenue vs Number of Customers — Scatter Plot

```
plt.scatter(df["Number_of_Customers"], df["Monthly_Revenue"], color='red')plt.xlabel("Number of Customers")plt.ylabel("Monthly Revenue")plt.title("Monthly Revenue vs Number of Customers")plt.show()
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-22.png' | relative_url }}" alt="Monthly Revenue vs Number of Customers Scatter Plot" loading="lazy">
  <figcaption>Monthly Revenue vs Number of Customers Scatter Plot</figcaption>
</figure>

> BONUS: Machine Learning — Predictive Modeling

In bonus part I will show you simple linear regression model to predict “Monthly_Revenue” based on other numerical features.

### | Importing Libraries

```
from sklearn.linear_model import LinearRegressionfrom sklearn.metrics import mean_squared_errorfrom sklearn.model_selection import train_test_split, cross_val_score
```

### | Preparing Data and Training a Linear Regression Model

```
X = df.drop("Monthly_Revenue",axis=1)y =df[["Monthly_Revenue"]]X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=1)model = LinearRegression().fit(X,y)
```

### | Interpreting the Linear Regression Model’s Parameters

```
model.intercept_[0] # bias => 8.733464354341095model.coef_ # weights => 2.92023436,  2.1317151 ,  4.79050005, -0.12454138,                       # -4.68541494, -0.03409436
```

### | Linear Regression Model

|| y **=** bias **+** weight **x** variable ||

```
Monthly_Revenue = 8.73 + (2.92 x Number_of_customers) + (2.13 x Menu_Price) + (4.79 x Marketing_Spend) + (-0.12 x Average_Customer_Spending) + (-4.68 x Promotions) + (-0.03 x Reviews)
```

We can say that **Bias **is simply starting point for predictions when feature values are zero and **Weights** are impact each feature has on the prediction for every unit change

### | Testing data on our model

```
ex_data = [[81, 40, 5, 22.9, 1, 90]] column_names = ['Number_of_Customers', 'Menu_Price', 'Marketing_Spend',                 'Average_Customer_Spending', 'Promotions', 'Reviews']test_data = pd.DataFrame(ex_data, columns=column_names)model.predict(test_data)"""OUTPUT => array([[343.88764694]])"""
```

<figure>
  <img src="{{ '/images/medium_posts/data-manipulation-with-pandas-23.png' | relative_url }}" alt="sample data from dataset" loading="lazy">
  <figcaption>sample data from dataset</figcaption>
</figure>

So after model is trained on our data we give example data for it to predict and Monthly_Revenue from dataset is **326.529** and the predicted Monthly_Revenue is **343.887**

### | Model Performance

- **RMSE** (Root Mean Square Error): Think of this like an average error our model makes. For our training data, which the model has seen, this error is about 57.82. For our unseen test data, it’s slightly higher at 60.34. This is pretty common because the model tends to perform a bit better on the data it has learned from.
- **R-squared**: This tells us what percentage of the change in our target (monthly revenue) can be explained by the model’s features. Here, we have an R-squared of 0.68 for training data and 0.69 for test data, meaning our features explain about 68–69% of the variability in revenue.
- **10-Fold Cross Validation RMSE:** To ensure our model’s performance isn’t a fluke of how we split the data, we use cross-validation. Our 10-fold cross-validation RMSE is 58.71, which aligns with our other RMSE values, reassuring us that our model is reliable.

```
#Train RMSEy_pred = model.predict(X_train)np.sqrt(mean_squared_error(y_train,y_pred)) # 57.82#Train r-squared errormodel.score(X_train, y_train) #0.68#Test RMSEy_pred = model.predict(X_test)np.sqrt(mean_squared_error(y_test,y_pred)) #60.34#Test r-squared errormodel.score(X_test, y_test) #0.69#10 Fold Cross Validation RMSEnp.mean(np.sqrt(-cross_val_score(model,                                 X,                                 y,                                 cv=10,                                 scoring="neg_mean_squared_error"))) # 58.70
```

Thank you for taking the time to read through this piece. I’m glad to share these insights and hope they’ve been informative. If you enjoyed this article and are looking forward to more content like this, feel free to stay connected by following my Medium profile. Your support is greatly appreciated. Until the next article, take care and stay safe!

Connect with me across the web, you can explore my digital world through the link below, including more articles, projects, and personal interests, check out.

[yavuzertugrul | Twitter, Instagram | Linktree](https://linktr.ee/yavuzertugrul)

[Data Manipulation with Pandas](https://levelup.gitconnected.com/data-manipulation-with-pandas-d1be327c1096) was originally published in [Level Up Coding](https://levelup.gitconnected.com) on Medium, where people are continuing the conversation by highlighting and responding to this story.
