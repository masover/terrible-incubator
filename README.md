# An Incubator for Terrible Startup Ideas

It's like asking ChatGPT if it has any startup ideas,
except it's far less likely to produce anything useful.

It is unfortunately *live* at https://forkbox.net/terrible-incubator/

* Several word lists and templates were provided by ChatGPT.
* [NLTK](https://www.nltk.org/) was used, along with the
  [Brown](http://korpus.uib.no/icame/brown/bcm.html)
  and
  [WordNet](https://wordnet.princeton.edu/)
  corpora, to generate one of the word lists.
* At runtime, powered entirely by [Vanilla JS](http://vanilla-js.com/).

## FAQ

### This looks so retro. Why didn't you add any CSS?

[I did.](main.css)

### Ugh! That's just `display: block` over and over. Why is it so terrible?

We're just trying to eat our own dogfood as a Terrible Ideas Incubator.

### You've got a hundred-line [god object](https://en.wikipedia.org/wiki/God_object) here! And where are the tests?

Again, we're just eating our own...
look, you knew what this repository would be when you clicked on it.