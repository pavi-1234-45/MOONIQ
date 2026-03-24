import os
import glob
import re

base_dir = r'c:\Users\gopik\OneDrive\Desktop\MOONIQ\b_caffcB4G90q-1774263303114'
files = glob.glob(os.path.join(base_dir, '**', '*.ts*'), recursive=True)

for fpath in files:
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # we want to match: `${API_BASE}/something"
        # and replace it with: `${API_BASE}/something`
        # Using a regex that finds `${API_BASE}` and replaces the NEXT double quote with a backtick ONLY on that line
        
        # A simpler replace since we know the exact patterns occurring:
        new_content = re.sub(r'(\$\{API_BASE\}[^"]*)"', r'\1`', content)
        
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed {fpath}')
    except Exception as e:
        print(f"Error reading {fpath}: {e}")
