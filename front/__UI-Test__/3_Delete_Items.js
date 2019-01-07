import { Selector } from "testcafe";

fixture`Delete Items`.page`localhost:3000`;

test("Delete an item", async t => {
  await t
    .setNativeDialogHandler(type => {
      switch (type) {
        case "confirm":
          return true;
      }
    })
    .click("#deletetest120")
    .expect(Selector("#snackbar").innerText)
    .eql("Product Deleted Successfully!");
});
