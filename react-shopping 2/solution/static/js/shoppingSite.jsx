class App extends React.Component {
  constructor() {
    super();

    this.state = {
      melons: {},
      shoppingCart: {}
    };

    this.renderAllMelonsPage = this.renderAllMelonsPage.bind(this);
    this.renderShoppingCart = this.renderShoppingCart.bind(this);
  }

  componentDidMount() {
    $.get('/api/melons', (melons) => {
      this.setState({ melons: melons });
    });
  }

  addMelon(melonCode) {
    this.setState((prevState) => {
      const shoppingCart = { ...prevState.shoppingCart };

      if (shoppingCart[melonCode]) {
        shoppingCart[melonCode] += 1;
      } else {
        shoppingCart[melonCode] = 1;
      }

      return { shoppingCart: shoppingCart };
    });
  }

  renderHomePage() {
    return (
      <HomePage>
        <h1>Ubermelon</h1>
        <p className="lead">Melons on demand.</p>
      </HomePage>
    );
  }

  renderAllMelonsPage() {
    const melonCards = [];

    for (const melon of Object.values(this.state.melons)) {
      const melonCard = (
        <MelonCard
          key={melon.melon_code}
          code={melon.melon_code}
          name={melon.name}
          imgUrl={melon.image_url}
          price={melon.price}
          handleAddToCart={() => {
            this.addMelon(melon.melon_code);
          }}
        />
      );

      melonCards.push(melonCard);
    }

    return (
      <AllMelonsPage>
        {melonCards}
      </AllMelonsPage>
    );
  }

  renderShoppingCart() {
    const melons = this.state.melons;
    const shoppingCart = this.state.shoppingCart;

    const melonRows = [];
    let total = 0;
    for (const [ melonCode, qty ] of Object.entries(shoppingCart)) {
      const melon = melons[melonCode];

      const row = (
        <tr>
          <td>{melon.name}</td>
          <td>${melon.price.toFixed(2)}</td>
          <td>{qty}</td>
        </tr>
      );
      melonRows.push(row);

      total += melon.price * qty;
    }

    return (
      <ShoppingCartPage>
        <table className="table">
          <thead>
            <tr>
              <th>Melon</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {melonRows}
          </tbody>
        </table>
        <p className="lead">Total: ${total.toFixed(2)}</p>
      </ShoppingCartPage>
    );
  }

  render() {
    let cartLength = 0;
    for (const value of Object.values(this.state.shoppingCart)) {
      cartLength += value;
    }

    return (
      <ReactRouterDOM.BrowserRouter>
        <Navbar
          logo="/static/img/watermelon.png"
          brand="Ubermelon"
        >
          <ReactRouterDOM.NavLink
            to="/shop"
            activeClassName="navlink-active"
            className="nav-link"
          >
            Shop for Melons
          </ReactRouterDOM.NavLink>
          <ReactRouterDOM.NavLink
            to="/cart"
            activeClassName="navlink-active"
            className="nav-link"
          >
            Shopping Cart ({cartLength})
          </ReactRouterDOM.NavLink>
        </Navbar>

        <div className="container-fluid">
          <ReactRouterDOM.Route
            exact
            path="/"
            render={this.renderHomePage}
          />
          <ReactRouterDOM.Route
            exact
            path="/shop"
            render={this.renderAllMelonsPage}
          />
          <ReactRouterDOM.Route
            exact
            path="/cart"
            render={this.renderShoppingCart}
          />
        </div>
      </ReactRouterDOM.BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
