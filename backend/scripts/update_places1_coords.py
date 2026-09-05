import time

for attempt in range(5):
    try:
        with open('backend/database/datasets/places_1.csv', 'r+', encoding='utf-8') as f:
            content = f.read()
            content = content.replace('13.009,80.2406,"Semmozhi Poonga', '13.0505,80.2505,"Semmozhi Poonga')
            content = content.replace('11.0167,76.9667,"Eachanari Vinayagar', '10.9419,76.9697,"Eachanari Vinayagar')
            f.seek(0)
            f.write(content)
            f.truncate()
            print('Successfully updated places_1.csv')
            break
    except Exception as e:
        print(f'Attempt {attempt}: {e}')
        time.sleep(1)
