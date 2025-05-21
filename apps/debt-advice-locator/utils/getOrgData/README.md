# Debt Advice Locator - Update CSV to JSON

This guide provides a step-by-step process for updating the organisations CSV file to JSON format for the Debt Advice Locator tool.

## Steps

1. **Navigate to the DebtAdviceLocator utils directory**

   ```sh
   cd apps/debt-advice-locator/utils/getOrgData
   ```

2. **Place the updated CSV file**

   - Download latest CSV file maps sharepoint `https://mapsorg.sharepoint.com.mcas.ms/sites/TMT-TechMigrationTeam/_layouts/15/doc.aspx?sourcedoc={affb93e7-e2aa-40b3-a61c-fce124aac086}&action=edit`
   - The file should be named `organisations.csv`.
   - Ensure the updated CSV file is placed in the `apps/debt-advice-locator/utils/getOrgData` directory.

3. **Run the conversion script**

   - Execute the script to convert the CSV file to JSON format located in the `apps/debt-advice-locator/utils/getOrgData` directory.

   ```sh
   node convert-csv-json.js
   ```

4. **Verify the output**

   - The JSON file will be generated in the `apps/debt-advice-locator/public/json` directory.
   - The file will be named `organisations-face-to-face.json`, `organisations-lng-lat.json`, `organisations-tel-online.json`.

## Notes

- Ensure the CSV file follows the same schema, validate the JSON output before committing.
