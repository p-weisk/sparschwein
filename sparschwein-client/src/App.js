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
import { faCartPlus, faPiggyBank, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import Purchases from './components/Purchases';
import Home from './components/Home';
import PurchaseCreationDialog from './components/PurchaseCreationDialog';
import PeriodCreationDialog from './components/PeriodCreationDialog';
import BalanceWidget from './components/BalanceWidget';
import Periods from './components/Periods';

function App() {

  const [state, setState] = useState({
    loadingStatus: 'loading',
    Budget: 0,
    Spent: 0
  });

  const fetchBalance = () => {
    const username = localStorage.getItem('apiUser');
    const password = localStorage.getItem('apiPassword');           
    fetch('/api/periods/current', {
      headers: {
        'Authorization': 'Basic ' + btoa(username + ":" + password)
      }
    })
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
    setInterval(fetchBalance, 30000);
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
          <Route path="/periods/creation-dialog">
            <PeriodCreationDialog updateBalance={fetchBalance} />
          </Route>
          <Route path="/periods">
            <Row>
              <Col>
                <Link to="/periods/creation-dialog">
                  <div className="lead text-center p-3 border border-primary rounded">
                    <FontAwesomeIcon icon={ faPlusCircle } />
                    <span className="font-weight-bold" style={{paddingLeft: "16px"}}>
                      Periode erstellen
                    </span>
                  </div>
                </Link>
                <hr className="my-3" />
              </Col>
            </Row>
            <Periods />
          </Route>
          <Route path="/purchases/creation-dialog">
            <PurchaseCreationDialog updateBalance={fetchBalance} />
          </Route>
          <Route path="/purchases">
            <Purchases />
          </Route>
          <Route path="/shoppinglist">
            
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
      <footer style={{backgroundColor: "#192a56", color: "white", padding: "16px 0 32px"}}>
      <Container>
        <Row>
          <Col>
            <h6>API-Zugangsdaten</h6>
            <form>
              <div className="form-group">
                <label>Username: </label>
                <input type='text' name="username" id="saveusername" className="form-control" />
              </div>
              <div className="form-group">
                <label>Password: </label>
                <input type='text' name="password" id="savepassword" className="form-control" />
              </div>
              <button type="button" className="btn btn-outline-light" onClick={()=>{
                const username = document.getElementById("saveusername").value;
                const password = document.getElementById("savepassword").value;
                localStorage.setItem("apiUser", username);
                localStorage.setItem("apiPassword", password);
                setTimeout(fetchBalance, 500);
              }} >Save credentials</button>
            </form>
          </Col>
        </Row>
      </Container>
      </footer>
    </div>
  );
}

export default App;
