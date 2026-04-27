import os
import re
from pathlib import Path

SRC_DIR = "./"
OUTPUT_DIR = "./modern-angular"

def create_output_structure():
    os.makedirs(f"{OUTPUT_DIR}/src/app/components", exist_ok=True)
    os.makedirs(f"{OUTPUT_DIR}/src/app/services", exist_ok=True)

def find_js_files():
    js_files = []
    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith(".js"):
                js_files.append(os.path.join(root, file))
    return js_files

def convert_controller(content, filename):
    match = re.search(r"\.controller\(['\"](.*?)['\"]", content)
    if not match:
        return None

    name = match.group(1)
    class_name = name.replace("Ctrl", "") + "Component"

    ts_content = f"""
import {{ Component }} from '@angular/core';

@Component({{
  selector: 'app-{name.lower()}',
  templateUrl: './{name.lower()}.component.html'
}})
export class {class_name} {{
  constructor() {{
    console.log('{class_name} initialized');
  }}
}}
"""
    return name, ts_content

def convert_service(content):
    match = re.search(r"\.service\(['\"](.*?)['\"]", content)
    if not match:
        return None

    name = match.group(1)
    class_name = name + "Service"

    ts_content = f"""
import {{ Injectable }} from '@angular/core';

@Injectable({{
  providedIn: 'root'
}})
export class {class_name} {{
  constructor() {{}}
}}
"""
    return name, ts_content

def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)

def process_files():
    js_files = find_js_files()

    for file in js_files:
        with open(file, "r", errors="ignore") as f:
            content = f.read()

        # Convert Controllers
        controller = convert_controller(content, file)
        if controller:
            name, ts = controller
            output_path = f"{OUTPUT_DIR}/src/app/components/{name.lower()}.component.ts"
            write_file(output_path, ts)
            print(f"Converted Controller: {name}")

        # Convert Services
        service = convert_service(content)
        if service:
            name, ts = service
            output_path = f"{OUTPUT_DIR}/src/app/services/{name.lower()}.service.ts"
            write_file(output_path, ts)
            print(f"Converted Service: {name}")

def main():
    print("Starting AngularJS → Angular transformation...")
    create_output_structure()
    process_files()
    print("Transformation completed. Check 'modern-angular' folder.")

if __name__ == "__main__":
    main()
