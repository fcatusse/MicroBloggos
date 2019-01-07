import { Selector } from "testcafe";

fixture`Edit Items`.page`localhost:3000`;

test("Edit a valid item", async t => {
  await t
    .click("#edittest20")
    .typeText("#name", "1")
    .click("#submitform")
    .expect(Selector("#snackbar").innerText)
    .eql("Product Updated Successfully!");
});

test("Edit a non valid item", async t => {
  await t
    .click("#edittest120")
    .typeText("#name", "test")
    .typeText("#quantity", "beaucoup")
    .typeText("#unittype", "Kg")
    .click("#submitform")
    .expect(Selector("#snackbar").innerText)
    .eql("Product Update Failed!");
});
