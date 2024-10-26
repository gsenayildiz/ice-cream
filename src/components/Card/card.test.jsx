import { render, screen } from "@testing-library/react";
import Card from "./index";
import userEvent from "@testing-library/user-event";

// prop olaraka gönderielen item
const item = {
  name: "Chocolate",
  imagePath: "/images/chocolate.png",
  id: "d539",
};

// prop olarak gönderilicek basket
const basket = [
  {
    name: "Chocolate",
    imagePath: "/images/chocolate.png",
    id: "d539",
    amount: 3,
  },
  {
    name: "Vanilla",
    imagePath: "/images/vanilla.png",
    id: "bafc",
    amount: 1,
  },
];

//çikolatasız sepet
const otherBasket = [
  {
    name: "Vanilla",
    imagePath: "/images/vanilla.png",
    id: "bafc",
    amount: 3,
  },
];

// prop olarak veri alan bir bileşeni test ediyorsak bileşenin aldığı propları test ortamnındada göndermemiz gerekli
test("Miktar, başlık, fotoğraf gelen propa göre ekrana basılır", () => {
  render(
    <Card
      item={item}
      addToBasket={() => {}}
      removeFromBasket={() => {}}
      basket={basket}
    />
  );

  //miktar spanı çağır
  const amount = screen.getByTestId("amount");

  //span içeriği 3 mü kantrol et
  expect(amount).toHaveTextContent(/^3$/);

  //chocolate yazısı elrana geldi mi kontrol et  1.YOL
  //const name = screen.getByText("Chocolate");
  // expect(name).toBeInTheDocument();

  // 2.YOL
  screen.getByText("Chocolate");

  //resim elementini çağır
  const img = screen.getByAltText("çeşit-resim");

  //resmin kaynagı doğru mu kontrol et
  expect(img).toHaveAttribute("src", "/images/chocolate.png");
});

test("Butonlara tıklanınca fonksiyonlar doğru parametrelerle çalışır", async () => {
  const user = userEvent.setup();

  //prop olarak gönderilecek fonk test ediceksek jest yani mock aracılığı ile test edilebilir sahte fonk oluşturulur
  const addMockFn = jest.fn();
  const removeMockFn = jest.fn();

  // test edilecek bileşenı renderla
  render(
    <Card
      item={item}
      basket={basket}
      addToBasket={addMockFn}
      removeFromBasket={removeMockFn}
    />
  );

  // butonları al
  const addBtn = screen.getByRole("button", { name: /ekle/i });
  const delBtn = screen.getByRole("button", { name: /azalt/i });

  // ekle butonuna tıklA
  await user.click(addBtn);

  //addToBasket methodu doğru parmetreler ile  çalıştı mı
  expect(addMockFn).toHaveBeenCalledWith(item);

  // azalt butonu tıkla
  await user.click(delBtn);

  // removeFromButton methodu doğru parametreler ile çalıştı mı
  expect(removeMockFn).toHaveBeenCalledWith(item.id);
});
// describe aynı işlevin testlerini bir araya getirmek için kullandığımız bir nevi testleri kategorize eden method 
describe("azalt butonunun aktiflik testleri", () => {
  it("sepette item varsa buton aktiftir", () => {
    render(<Card item={item} basket={basket} />);

    const button = screen.getByRole("button", { name: "azalt" });

    expect(button).toBeEnabled();
  });

  //sepette aynı itemdan yoksa bu
  it("sepette aynı itemdan  yoksa  buton inaktiftir", () => {
    render(<Card item={item} basket={otherBasket} />);

    const button = screen.getByRole("button", { name: "azalt" });

    expect(button).toBeDisabled();
  });
});
