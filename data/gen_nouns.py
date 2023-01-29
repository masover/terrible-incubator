#!/usr/bin/env python3
import json
from nltk.corpus import wordnet
from nltk.corpus import brown
import re

# ChatGPT also provided heavy inspiration for the rough approach,
# though it had _many_ false starts here.
nouns = set()
singulars = set()
for word, tag in brown.tagged_words():
  if tag == 'NNS':
    singular = wordnet.morphy(word)
    if singular:
      nouns.add(word)
      singulars.add(singular)
for word, tag in brown.tagged_words():
  if tag == 'NN' and word not in singulars:
    nouns.add(word)

# At least the regex idea was mine!
_ALPHA = re.compile(r'^[A-Za-z][a-z]*$')
probable_words = (word for word in nouns if _ALPHA.match(word))

print(f'export nouns = ${json.dumps(list(probable_words), indent=2)};')