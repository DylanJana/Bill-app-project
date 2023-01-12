import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router";
import userEvent from "@testing-library/user-event";
// Import BillsUI this function create html of Bills page
import BillsUI from "../views/BillsUI.js";
import '@testing-library/jest-dom';
import { bills } from '../fixtures/bills.js';

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
    })
  );
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
  
  describe("When I am on NewBill Page", () => {
    test("Then element with text Envoyer une note de frais is available", async() => {
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByText('Envoyer une note de frais'));
      await waitFor(() => screen.getByTestId('form-new-bill'));
      const textBtn = screen.getByText('Envoyer une note de frais');
      const formNewBill = screen.getByTestId('form-new-bill');
      expect(textBtn).toBeVisible();
      expect(formNewBill).toBeTruthy();
    })
  });

  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.NewBill);

      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      expect(mailIcon).toBeVisible();
    });
  });

  describe("when I submit the form with empty fields", () => {
    test("then I should stay on new Bill page", () => {
      window.onNavigate(ROUTES_PATH.NewBill);
      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      expect(screen.getByTestId("expense-name").value).toBe("");
      expect(screen.getByTestId("datepicker").value).toBe("");
      expect(screen.getByTestId("amount").value).toBe("");
      expect(screen.getByTestId("vat").value).toBe("");
      expect(screen.getByTestId("pct").value).toBe("");
      expect(screen.getByTestId("file").value).toBe("");

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(form).toBeTruthy();
    });
  });

  /* ------------------------------- SUITE PROJET ---------------------------------------*/

  describe("when I upload a file with the wrong format", () => {
    test("then I should stay on new Bill page", async () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const file = new File(["hello"], "hello.txt", { type: "document/txt" });
      const inputFile = screen.getByTestId("file");

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);

      fireEvent.change(inputFile, { target: { files: [file] } });

      const form = screen.getByTestId("form-new-bill");

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].type).toBe("document/txt");
      expect(form).toBeTruthy();
    });

    test("Then the error message should be displayed", () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      // Create file document PDF
      const file = new File(["doc"], "doc.pdf", { type: "document/pdf" });
      // Get input to upluoad my file
      const inputFile = screen.getByTestId("file");
      // Create spy function to check handleChangeFile has been called
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      // Add Event change to inputFile
      inputFile.addEventListener("change", handleChangeFile);
      // Simulate user change
      fireEvent.change(inputFile, { target: { files: [file] } });
      // Get my error message
      let errorMessage = screen.getByTestId('error-message');
      expect(errorMessage.textContent).toEqual(
        expect.stringContaining(
          'Formats acceptés .jpg, .jpeg, png'
        )
      )
    })
  });

  describe("when I upload a file with the good format", () => {
    test("then input file should show the file name", async () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const file = new File(["img"], "image.png", { type: "image/png" });
      const inputFile = screen.getByTestId("file");

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);

      userEvent.upload(inputFile, file);

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0]).toStrictEqual(file);
      expect(inputFile.files[0].name).toBe('image.png');
      expect(inputFile.files[0].type).toBe('image/png');
    });
  });
});

describe("Given I am connected as Employee on NewBill page, and submit the form", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
  });
 
 describe("when APi is working well", () => {
    test("then i should be sent on bills page with bills updated", async () => {
      jest.spyOn(mockStore, "bills");

      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "azerty@email.com",
        })
      );

      const newBillJs = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn((e) => newBillJs.handleChangeFile(e));
      const uploadInput = screen.getByTestId("file");
      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBillJs.handleSubmit(e));

      uploadInput.addEventListener("change", handleChangeFile);
      // Create spy function of newBillJs.updateBill
      newBillJs.updateBill = jest.fn();
      // Create spy function of newBillJs.OnNavigate
      newBillJs.onNavigate = jest.fn();

      const validBill = {
        type: "Transport",
        name: "Train Paris Toulouse",
        date: "2022-07-02",
        amount: 350,
        vat: 70,
        pct: 20,
        commentary: "Prix billet TGV : 350€",
        fileUrl: "../img/fakeFile.jpg",
        fileName: "billet-tgv.jpg",
        status: "pending",
      };

      screen.getByTestId("expense-type").value = validBill.type;
      screen.getByTestId("expense-name").value = validBill.name;
      screen.getByTestId("datepicker").value = validBill.date;
      screen.getByTestId("amount").value = validBill.amount;
      screen.getByTestId("vat").value = validBill.vat;
      screen.getByTestId("pct").value = validBill.pct;
      screen.getByTestId("commentary").value = validBill.commentary;
      newBillJs.fileName = validBill.fileName;
      newBillJs.fileUrl = validBill.fileUrl;

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(newBillJs.updateBill).toHaveBeenCalled();
      expect(newBillJs.onNavigate).toHaveBeenCalled();
    });
  });
});

describe('When an error occurs on API', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        type: 'Employee',
        email: 'a@a',
      })
    )

    document.body.innerHTML = NewBillUI()
  })

  // Important to run this test first, because I'm always on NewBill page
  describe("user submit form valid", () => {
    test("call api update bills", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localeStorage: localStorageMock,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const form = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(mockStore.bills).toHaveBeenCalled();
    });
  });

  test("post new bills from mock API POST", async () => { 

    const postSpy = jest.spyOn(mockStore, "bills");
    const isBills = mockStore.bills();
    const bills = await isBills.update(); 
    document.body.innerHTML = NewBillUI();
    // function bills with parameters mockstore has called
    expect(postSpy).toHaveBeenCalled(); 
    expect(bills).toBeDefined()
  })

  test('Then new bill are added to the API but fetch fails with 404 message error', async () => {
    const spyedMockStore = jest.spyOn(mockStore, 'bills')

    spyedMockStore.mockImplementationOnce(() => {
      return {
        create: jest.fn().mockRejectedValue(new Error('Erreur 404')),
      }
    })

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname, data: bills })
    }

    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      bills: bills,
      localStorage: window.localStorage,
    })

    const fileInput = screen.getByTestId('file')

    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(['test'], 'test.jpg', {
            type: 'image/jpeg',
          }),
        ],
      },
    })

    await spyedMockStore()

    // Create an page with BillsUI function and replace array on this page by error text
    const html = BillsUI ({error:"Erreur 404"});
    document.body.innerHTML = html;
    const message = screen.getByText(/Erreur 404/);
    expect(message).toBeTruthy();

    expect(spyedMockStore).toHaveBeenCalled()
    // Property billId to be null because my test return error 404. newBill doesn't
    // create an ID
    expect(newBill.billId).toBeNull()
    expect(newBill.fileUrl).toBeNull()

    spyedMockStore.mockReset()
    // mockRestore work only spyOn function
    spyedMockStore.mockRestore()
  })

  test('Then new bill are added to the API but fetch fails with 500 message error', async () => {
    const spyedMockStore = jest.spyOn(mockStore, 'bills')

    spyedMockStore.mockImplementationOnce(() => {
      return {
        create: jest.fn().mockRejectedValue(new Error('Erreur 500')),
      }
    })

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname, data: bills })
    }

    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      bills: bills,
      localStorage: window.localStorage,
    })

    const fileInput = screen.getByTestId('file')

    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(['test'], 'test.jpg', {
            type: 'image/jpeg',
          }),
        ],
      },
    })

    await spyedMockStore()
    // Create an page with BillsUI function and replace array on this page by error text
    const html = BillsUI ({error:"Erreur 500"});
    document.body.innerHTML = html;
    const message = screen.getByText(/Erreur 500/);
    expect(message).toBeTruthy();

    expect(spyedMockStore).toHaveBeenCalled()

    expect(newBill.billId).toBeNull()
    expect(newBill.fileUrl).toBeNull()
    expect(newBill.fileName).toBeNull()
  })
})