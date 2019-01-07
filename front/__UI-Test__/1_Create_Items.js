import { Selector } from "testcafe";

fixture`Create Items`.page`localhost:3000`;

test("Create a valid item", async t => {
  await t
    .click("#addnewitem")
    .typeText("#name", "test")
    .typeText("#quantity", "20")
    .typeText("#unittype", "Kg")
    .click("#submitform")
    .expect(Selector("#snackbar").innerText)
    .eql("Product Added Successfully!");
});

test("Create a non valid item", async t => {
  await t
    .click("#addnewitem")
    .typeText("#name", "test")
    .typeText("#quantity", "beaucoup")
    .typeText("#unittype", "Kg")
    .click("#submitform")
    .expect(Selector("#snackbar").innerText)
    .eql("Product failed to save!");
});
