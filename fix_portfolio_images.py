import os
import re
import shutil
import urllib.parse

BASE_DIR = r"c:\Users\NIRANJANA KRISHNA\Desktop\myportfolio"
IMAGES_DIR = os.path.join(BASE_DIR, "images")
INDEX_PATH = os.path.join(BASE_DIR, "index.html")
STYLE_PATH = os.path.join(BASE_DIR, "style.css")
APP_JS_PATH = os.path.join(BASE_DIR, "app.js")

if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR)

files_to_process = [INDEX_PATH, STYLE_PATH, APP_JS_PATH]

def decode_file_uri(uri):
    if uri.startswith("file:///"):
        uri = uri[8:]
    elif uri.startswith("file://"):
        uri = uri[7:]
    path = urllib.parse.unquote(uri)
    path = os.path.normpath(path)
    return path

with open(INDEX_PATH, "r", encoding="utf-8") as f:
    html_content = f.read()

img_tags = re.findall(r'<img[^>]+>', html_content, re.IGNORECASE)

uri_to_name = {}
counts = {
    "profile": 1,
    "autoresq": 1,
    "mediswift": 1,
    "admission": 1,
    "gbm": 1,
    "project": 1
}

for tag in img_tags:
    uri_match = re.search(r'(file:///[^\s"\'\)]+\.(?:png|jpg|jpeg|gif|webp|svg))', tag)
    if not uri_match:
        continue
    uri = uri_match.group(1)
    
    alt_match = re.search(r'alt="([^"]+)"', tag, re.IGNORECASE)
    alt_text = alt_match.group(1).lower() if alt_match else ""
    
    if "profile" in alt_text or "niranjana" in alt_text:
        name = "profile"
    elif "autoresq" in alt_text:
        name = f"autoresq-{counts['autoresq']}"
        counts['autoresq'] += 1
    elif "mediswift" in alt_text:
        name = f"mediswift-{counts['mediswift']}"
        counts['mediswift'] += 1
    elif "admission" in alt_text:
        name = f"admission-{counts['admission']}"
        counts['admission'] += 1
    elif "gbm" in alt_text:
        name = f"gbm-{counts['gbm']}"
        counts['gbm'] += 1
    else:
        name = f"project-{counts['project']}"
        counts['project'] += 1
        
    ext = os.path.splitext(uri)[1]
    uri_to_name[uri] = f"{name}{ext}"

file_uri_pattern = re.compile(r"(file:///[^\s\"'\)]+\.(?:png|jpg|jpeg|gif|webp|svg))")
for file_path in files_to_process:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            found = file_uri_pattern.findall(content)
            for uri in found:
                if uri not in uri_to_name:
                    name = f"project-{counts['project']}"
                    counts['project'] += 1
                    ext = os.path.splitext(uri)[1]
                    uri_to_name[uri] = f"{name}{ext}"

uri_to_rel_path = {}
missing_files = []

print("Copying images...")
for uri, name in uri_to_name.items():
    local_path = decode_file_uri(uri)
    dest_path = os.path.join(IMAGES_DIR, name)
    rel_path = f"images/{name}"
    
    if os.path.exists(local_path):
        try:
            shutil.copy2(local_path, dest_path)
            uri_to_rel_path[uri] = rel_path
            print(f"Copied {local_path} -> {rel_path}")
        except Exception as e:
            print(f"Error copying {local_path}: {e}")
    else:
        print(f"WARNING: Image not found locally: {local_path}")
        missing_files.append((rel_path, local_path))
        uri_to_rel_path[uri] = rel_path

print("\nUpdating files...")
def process_img_tags(match):
    tag = match.group(0)
    uri_match = re.search(r'(file:///[^\s"\'\)]+\.(?:png|jpg|jpeg|gif|webp|svg))', tag)
    if uri_match:
        uri = uri_match.group(1)
        if uri in uri_to_rel_path:
            rel_path = uri_to_rel_path[uri]
            tag = re.sub(r'src="[^"]+"', f'src="{rel_path}"', tag)
            tag = re.sub(r'\s*onerror="[^"]+"', '', tag)
    return tag

for file_path in files_to_process:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    content = re.sub(r'<img[^>]+>', process_img_tags, content)
    
    for uri, rel_path in uri_to_rel_path.items():
        content = content.replace(uri, rel_path)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Images copied and files updated successfully.")
if missing_files:
    print("\n--- MISSING IMAGES ---")
    for rel, loc in missing_files:
        print(f"Please provide an image for '{rel}'. Original path was '{loc}'")
