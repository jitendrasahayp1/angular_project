import json
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
SRC_DIR = ROOT_DIR / "src" / "js"
OUTPUT_DIR = ROOT_DIR / "modern-angular"
APP_DIR = OUTPUT_DIR / "src" / "app"
COMPONENTS_DIR = APP_DIR / "components"
SERVICES_DIR = APP_DIR / "services"


def create_output_structure():
    COMPONENTS_DIR.mkdir(parents=True, exist_ok=True)
    SERVICES_DIR.mkdir(parents=True, exist_ok=True)


def clean_generated_files():
    for path in COMPONENTS_DIR.glob("*.component.ts"):
        path.unlink()
    for path in COMPONENTS_DIR.glob("*.component.html"):
        path.unlink()
    for path in SERVICES_DIR.glob("*.service.ts"):
        path.unlink()


def write_package_json():
    angular_version = "^17.3.0"
    package_json = {
        "name": "modern-angular",
        "version": "0.0.1",
        "private": True,
        "scripts": {
            "start": "ng serve",
            "build": "ng build",
            "test": "ng test",
        },
        "dependencies": {
            "@angular/animations": angular_version,
            "@angular/common": angular_version,
            "@angular/compiler": angular_version,
            "@angular/core": angular_version,
            "@angular/forms": angular_version,
            "@angular/platform-browser": angular_version,
            "@angular/platform-browser-dynamic": angular_version,
            "@angular/router": angular_version,
            "rxjs": "^7.8.1",
            "tslib": "^2.6.2",
            "zone.js": "^0.14.4",
        },
        "devDependencies": {
            "@angular-devkit/build-angular": angular_version,
            "@angular/cli": angular_version,
            "@angular/compiler-cli": angular_version,
            "typescript": "^5.4.0",
        },
    }
    write_file(OUTPUT_DIR / "package.json", json.dumps(package_json, indent=2) + "\n")


def write_file(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def find_js_files():
    if not SRC_DIR.exists():
        return []
    return sorted(SRC_DIR.rglob("*.js"))


def to_kebab_case(value: str) -> str:
    cleaned = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", value)
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", cleaned)
    return cleaned.strip("-").lower()


def to_pascal_case(value: str) -> str:
    words = re.split(r"[^a-zA-Z0-9]+", value)
    return "".join(word[:1].upper() + word[1:] for word in words if word)


def normalize_component_base(name: str) -> str:
    return re.sub(r"(Ctrl|Controller)$", "", name, flags=re.IGNORECASE)


def convert_controller(content: str):
    match = re.search(r"\.controller\(['\"](.*?)['\"]", content)
    if not match:
        return None

    raw_name = match.group(1)
    base = normalize_component_base(raw_name) or raw_name
    class_name = f"{to_pascal_case(base)}Component"
    file_stem = to_kebab_case(base)

    ts_content = (
        "import { Component } from '@angular/core';\n\n"
        "@Component({\n"
        f"  selector: 'app-{file_stem}',\n"
        f"  templateUrl: './{file_stem}.component.html'\n"
        "})\n"
        f"export class {class_name} {{\n"
        "}\n"
    )
    html_content = f"<p>{class_name} works.</p>\n"
    return raw_name, file_stem, ts_content, html_content


def convert_service(content: str):
    match = re.search(r"\.service\(['\"](.*?)['\"]", content)
    if not match:
        return None

    raw_name = match.group(1)
    base = re.sub(r"Service$", "", raw_name, flags=re.IGNORECASE)
    class_name = f"{to_pascal_case(base)}Service"
    file_stem = to_kebab_case(base)

    ts_content = (
        "import { Injectable } from '@angular/core';\n\n"
        "@Injectable({\n"
        "  providedIn: 'root'\n"
        "})\n"
        f"export class {class_name} {{\n"
        "}\n"
    )
    return raw_name, file_stem, ts_content


def process_files():
    js_files = find_js_files()
    if not js_files:
        print(f"No JS files found in: {SRC_DIR}")
        return

    converted_components = set()
    converted_services = set()

    for file in js_files:
        content = file.read_text(encoding="utf-8", errors="ignore")

        controller = convert_controller(content)
        if controller:
            name, file_stem, ts_content, html_content = controller
            if file_stem not in converted_components:
                write_file(COMPONENTS_DIR / f"{file_stem}.component.ts", ts_content)
                write_file(COMPONENTS_DIR / f"{file_stem}.component.html", html_content)
                converted_components.add(file_stem)
                print(f"Converted Controller: {name} -> {file_stem}.component.ts")

        service = convert_service(content)
        if service:
            name, file_stem, ts_content = service
            if file_stem not in converted_services:
                write_file(SERVICES_DIR / f"{file_stem}.service.ts", ts_content)
                converted_services.add(file_stem)
                print(f"Converted Service: {name} -> {file_stem}.service.ts")


def main():
    print("Starting AngularJS -> Angular transformation...")
    create_output_structure()
    clean_generated_files()
    write_package_json()
    process_files()
    print("Transformation completed. Check 'modern-angular' folder.")


if __name__ == "__main__":
    main()
