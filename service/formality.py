import pandas as pd
import re, pickle, pathlib, os


print('loading formality model...')
curdir = pathlib.Path(__file__).parent.absolute()
datadir = os.path.join(curdir, '..', 'data')

name_data_fn = os.path.join(datadir, 'name_data.csv')
name_data = pd.read_csv(name_data_fn, keep_default_na = False).set_index('word').T.to_dict()

with open(os.path.join(datadir, 'common_name_words.txt'), 'r') as f:
    common_name_words = [w.strip() for w in f.readlines()]

with open(os.path.join(datadir, 'common_desc_words.txt'), 'r') as f:
    common_desc_words = [w.strip() for w in f.readlines()]

with open(os.path.join(datadir, 'formality_features.txt'), 'r') as f:
    features = [w.strip() for w in f.readlines()]

with open(os.path.join(datadir, 'formality_model.p'), 'rb') as f:
    clf = pickle.load(f)

print('formality model loaded')
    
def title_ratio(text):
    words = [w for w in text.split() if re.search('[A-Za-z]', w)]
    return 0 if len(words) == 0 else sum(word.title() == word for word in words) / len(words)
def upper_ratio(text):
    words = [w for w in text.split() if re.search('[A-Za-z]', w)]
    return 0 if len(words) == 0 else sum(word.upper() == word for word in words) / len(words)

def get_n_name(name):
    words = name.split()
    return 0 if len(words) == 0 else sum(
        name_data.get(word.lower(), {}).get('is_name', False)
        for word in words
    )

def get_n_oov(name):
    words = name.split()
    return 0 if len(words) == 0 else sum(
        1-name_data.get(word.lower(), {}).get('in_brown', False)
        for word in words
    )

def get_features(user_name, user_description, created_date):
    name_normed = re.sub(' +', ' ', re.sub('[^A-Za-z ]', '', user_name.lower())).strip()
    desc_normed = re.sub(' +', ' ', re.sub('[^A-Za-z ]', '', user_description.lower())).strip()
    out = {
        'hash_name': '#' in user_name,
        'hash_desc': '#' in user_description,
        'name_title_ratio': title_ratio(user_name),
        'name_upper_ratio': upper_ratio(user_name),
        'desc_title_ratio': title_ratio(user_description),
        'desc_upper_ratio': upper_ratio(user_description),
        'age': pd.to_datetime(pd.Series([created_date])).astype(int).tolist()[0],
        'empty_desc': user_description == '',
        'XXX_name': re.search(r'\b[A-Z][A-Z][A-Z]\b', user_name) is not None,
        'XX_name': re.search(r'\b[A-Z][A-Z]\b', user_name) is not None,
        'empty_desc_normed': desc_normed == '',
        'name_nchars': len(name_normed),
        'name_nwords': len(name_normed.split()),
        'desc_nchars': len(desc_normed),
        'desc_nwords': len(desc_normed.split()),
        'n_name': get_n_name(name_normed),
        'name_oov': get_n_oov(name_normed),
        'desc_oov': get_n_oov(desc_normed),
    }
    out['n_name_ratio'] = 0 if out['name_nwords'] == 0 else out['n_name'] / out['name_nwords']
    out['name_oov_ratio'] = 0 if out['name_nwords'] == 0 else out['name_oov'] / out['name_nwords']
    out['desc_oov_ratio'] = 0 if out['desc_nwords'] == 0 else out['desc_oov'] / out['desc_nwords']
    for w in common_name_words:
        out[f'name_has_{w}'] = re.search(rf'\b{w}\b', user_name.lower()) is not None
    for w in common_desc_words:
        out[f'desc_has_{w}'] = re.search(rf'\b{w}\b', desc_normed.lower()) is not None
    return [out[feature] for feature in features]

def score_user(user_name, user_description, created_date):
    features = get_features(user_name, user_description, created_date)
    return clf.predict_proba([features])[0, 0]

if __name__ == '__main__':
    df = pd.read_csv('../data/cleaned_data.csv')
    row = df.sample(random_state = 0)
    user_name = row.user_name.tolist()[0]
    user_description = row.user_description.tolist()[0]
    created_date = row.user_created_at.tolist()[0]
    print('scoring:', user_name, user_description, created_date)
    score = score_user(user_name, user_description, created_date)
    print('score:', score)