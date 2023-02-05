import React, { useState, useEffect } from "react";
import { logout, syncTokens } from "../../helpers/syncTokens.helper";
import {
  get_request,
  default_request_config,
} from "../../helpers/request.helper";
import { getCookie } from "cookies-next";

//Scss
import styles from "../../styles/Book-table.module.scss";
import heading from "../../styles/Heading.module.scss";
import loader from "../../styles/Loader.module.scss";

//Utilities
import Indicator from "../../utilts/Indicator";
import Checkbox from "../../utilts/Checkbox";
import AddBook from "../../utilts/AddBook";
import DeleteBook from "../../utilts/DeleteBook";
import UpdateBook from "../../utilts/UpdateBook";
import AddLoan from "../../utilts/AddLoan";
import ErrorAlert from "../../utilts/ErrorAlert.util";

import HashLoader from "react-spinners/HashLoader";

import { useRouter } from "next/router";

const BooksTable = () => {
  //Use State
  const [books, setBooks] = useState([]);
  const [errorAlert, setErrorAlert] = useState(false);
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");
  let order = 1;
  const router = useRouter();

  async function getBooks() {
    try {
      const token = getCookie("token");
      const refresh = getCookie("refresh");
      const resp = await get_request("/book", {
        ...default_request_config,
        headers: {
          ...default_request_config.headers,
          "x-token": token,
          "x-refresh-token": refresh,
        },
      });
      if (resp.data.status == 200) {
        setBooks(resp.data.data);
      }
      syncTokens(resp);
    } catch (err) {
      if (err.message.includes(401)) {
        // unauthorized
        logout();
        router.push("/");
      } else {
        // some other error - create error message
        setErrorAlert(true);
      }
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className={styles.book_table}>

      {
        books.length || errorAlert ? (
          <div>
              {
                errorAlert ? (
                  <ErrorAlert
                    text="Bohužiaľ, nepodarilo sa načítať knihy."
                    btnText="Zatvoriť"
                    show={errorAlert}
                    setShow={(e) => setErrorAlert(e)}
                  />
                ) : null
              }

              <div className={heading.heading}>
                <h3>Prezerať knihy</h3>
                <AddBook handleGet={getBooks} />
              </div>

              {/* Searchbar */}
              <div className={styles.search}>
                <input
                  type="text"
                  placeholder="Vyhľadajte knihy..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className={styles.filter} onClick={() => setFilter(!filter)}>
                <Checkbox isTrue={filter} />
                Zobraziť iba voľné knihy
              </div>

              <div className={styles.table_wrapper}>
                <table>
                  <thead>
                    <tr>
                      <th>Číslo</th>
                      <th>Názov</th>
                      <th>Autor</th>
                      <th>ISBN</th>
                      <th>Voľná</th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {books
                      ? filter === false
                        ? books
                            .filter((val) => {
                              if (search === "") {
                                return val;
                              } else if (
                                val.name.toLowerCase().includes(search.toLowerCase())
                              ) {
                                return val;
                              }
                            })
                            .map((book, i) => (
                              <tr key={book.id}>
                                <td>{i + 1}.</td>
                                <td>{book.name}</td>
                                <td>{book.author}</td>
                                <td>{book.isbn}</td>
                                <td>
                                  {book.isAvailable ? (
                                    <Indicator color={"#51A3A3"} />
                                  ) : (
                                    <Indicator color={"#DD7373"} />
                                  )}
                                </td>
                                <td>
                                  {book.isAvailable ? (
                                    <AddLoan handleGet={getBooks} bookId={book.id} />
                                  ) : null}
                                </td>
                                <td>
                                  <UpdateBook
                                    i={i}
                                    id={book.id}
                                    bookName={book.name}
                                    bookAuthor={book.author}
                                    bookIsbn={book.isbn}
                                    handleGet={getBooks}
                                  />
                                </td>
                                <td>
                                  <DeleteBook handleGet={getBooks} id={book.id} />
                                </td>
                              </tr>
                            ))
                        : books
                            .filter((val) => {
                              if (search === "") {
                                return val;
                              } else if (
                                val.name.toLowerCase().includes(search.toLowerCase())
                              ) {
                                return val;
                              }
                            })
                            .map((book, i) =>
                              book.isAvailable
                                ? ((order = order + 1),
                                  (
                                    <tr key={book.id}>
                                      <td>{i + 1}.</td>
                                      <td>{book.name}</td>
                                      <td>{book.author}</td>
                                      <td>{book.isbn}</td>
                                      <td>
                                        {book.isAvailable ? (
                                          <Indicator color={"#51A3A3"} />
                                        ) : (
                                          <Indicator color={"#DD7373"} />
                                        )}
                                      </td>
                                      <td>
                                        {book.isAvailable ? (
                                          <AddLoan
                                            handleGet={getBooks}
                                            bookId={book.id}
                                          />
                                        ) : null}
                                      </td>
                                      <td>
                                        <UpdateBook
                                          i={order}
                                          id={book.id}
                                          bookName={book.name}
                                          bookAuthor={book.author}
                                          bookIsbn={book.isbn}
                                          handleGet={getBooks}
                                        />
                                      </td>
                                      <td>
                                        <DeleteBook
                                          handleGet={getBooks}
                                          id={book.id}
                                        />
                                      </td>
                                    </tr>
                                  ))
                                : null
                            )
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
        ) : (
          <div className={loader.loader}>
            <HashLoader color={"#40476D"} loading={true} size={40} />
          </div>
        )
      }

    </div>
  );
};

export default BooksTable;
