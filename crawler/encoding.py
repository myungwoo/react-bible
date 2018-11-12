import os

for fn in os.listdir('txt'):
    fp = os.path.join('txt', fn)
    with open(fp, encoding='euc-kr') as f:
        content = f.read()
    print(content, f)
    open(fp, 'w').write(content)