# supply-chain-calculator

A simple supply chain software, which makes it easy to resolve supply chains for management games like Factorio, Anno, etc.
It features different data set stores, which hold the recipes to manufacture the available items in a game


## How to use it

![supply-chain-calculator](https://i.gyazo.com/0ecd43a9987993e28c34a453c53f2fe9.png)
* The `Library` section holds different data set stores (referred to as `Books`), which hold the recipes to manufacture the available items in a game.
* The `Recipe` section contains all the available recipes of the currently selected `Book`


![supply-chain-calculator](https://i.gyazo.com/fe2b300a2a94dcd5e55e12f1e28cd397.png)
* The `Input` section lets you select the recipe and the amount you want to manufacture in the currently selected `Book`
* The `Results` section gives you information on the resources required to manufacture the requested products.
  * It is possible to switch the result layout from a tree view to a simple list view
  * It is also possible to show required factories instead of items per second 



## See a working demo under: https://xxpancakexx.github.io/#/


## Project setup for local development / usage

```
git clone https://github.com/xXPancakeXx/supply-chain-calculator.git
npm install
npm run serve
```
