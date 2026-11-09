# Debt Advice Locator - Update CSV to JSON

This guide provides a step-by-step process for updating the organisations CSV file to JSON format for the Debt Advice Locator tool.

## Steps

1. **Navigate to the scripts directory**

   ```sh
   cd apps/debt-advice-locator/utils/getOrgData/scripts
   ```

2. **Prepare the CSV file**

   - Download latest Excel file
   - Export it as a CSV
   - Rename the exported CSV file to: `organisations.csv`.
   - Move the CSV file into this directory.

3. **Run the conversion script**

   - Execute the script to convert the CSV file to JSON format.

   ```sh
   node convert-csv-json.js
   ```

4. **Verify the output**

   - The JSON files will be generated in the `apps/debt-advice-locator/public/json` directory.
   - The files will be named `organisations-face-to-face.json`, `organisations-lng-lat.json`, `organisations-tel-online.json`.

## Notes

- Ensure the CSV file follows the same schema, validate the JSON output before committing.
- Records are filtered by the `provides_face_to_face`, `provides_telephone` and `provides_web` flags: face-to-face organisations go into the face-to-face and lng-lat files (the latter holds coordinates only), and telephone or web organisations go into the tel-online file. A record can appear in both, and a record with none of the flags set will not appear in any output file.
- The conversion script automatically assigns line numbers as IDs to any records without an ID (currently all of them, as the exported CSV has no id column). These IDs are only added to the generated JSON files, not to the source CSV file.
- The script includes duplicate ID detection and automatically resolves conflicts by assigning new sequential IDs to duplicate entries.
