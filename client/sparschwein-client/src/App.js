import React, {useState, useEffect} from 'react';
import { 
  Switch,
  Route,
  Link,
  NavLink
} from 'react-router-dom';
import {
  Container,
  Col,
  Nav, 
  Navbar, 
  NavItem,
  Row
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import Purchases from './components/Purchases';
import Home from './components/Home';
import PurchaseCreationDialog from './components/PurchaseCreationDialog';
import BalanceWidget from './components/BalanceWidget';

function App() {

  const [state, setState] = useState({
    loadingStatus: 'loading',
    Budget: 0,
    Spent: 0
  });

  const fetchBalance = () => {
    fetch('http://localhost:8000/api/periods/current')
    .then((response) => {
        return response.json();
    })
    .then((json) => {
      if(!(Number.isInteger(json.Budget) && Number.isInteger(json.Spent))) {
        Promise.reject(new Error("Faulty response content"));
      } else {
        return json;
      }
    })
    .then((data) => {
        setState({
          loadingStatus: 'success',
          Budget: data.Budget,
          Spent: data.Spent
        });
    })
    .catch((error) => {
        console.log(error);
        setState({
          loadingStatus: 'error',
          Budget: 0,
          Spent: 0
        });
    });
  }

  useEffect(() => {
    fetchBalance();
    setInterval(fetchBalance, 5000);
  }, []);

  return (

    <div className="App">
      <header className="App-header">
        <Navbar color="light" light className="shadow-lg" style={{margin: "4px 0 24px"}}>
          <Container>
            <Link to="/" className="navbar-brand">
              <FontAwesomeIcon icon={faPiggyBank} color="#e056fd" />
              <span>  Sparschwein</span>
            </Link>
            <Nav>
              <NavItem>
                <NavLink to="/periods" className="nav-link">Perioden</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/purchases" className="nav-link">Einkäufe</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/purchases/creation-dialog" className="nav-link">
                  <FontAwesomeIcon icon={faCartPlus} />
                </NavLink>
              </NavItem>
            </Nav>
          </Container>
        </Navbar>
      </header>
      <Container>
        <BalanceWidget 
          loadingStatus={ state.loadingStatus }
          budget={ state.Budget }
          spent={ state.Spent }
        />
        <Switch>
          <Route path="/periods">
            Periods
          </Route>
          <Route path="/purchases/creation-dialog">
            <PurchaseCreationDialog updateBalance={fetchBalance}/>
          </Route>
          <Route path="/purchases">
            <Purchases />
          </Route>
          <Route path="/">
            <Home
              loadingStatus={ state.loadingStatus }
              budget={ state.Budget }
              spent={ state.Spent }
            />
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
