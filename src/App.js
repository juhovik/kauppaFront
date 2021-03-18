import './App.css';
import {useEffect, useState} from 'react';

const URL = 'http://localhost/kauppa/'

function App() {
const [items, setItems] = useState([])
const [item, setItem] = useState('')
const [amount, setAmount] = useState('')

useEffect(() => {
  let status = 0;
  fetch(URL + 'index.php')
  .then(res => {
    status = parseInt(res.status);
    return res.json()
  })
  .then(
    (res) => {
      if (status === 200) {
        setItems(res);
      } else {
        alert(res.error);
      }
    }, (error) => {
      alert(error);
    }
  )
}, [])

function remove(id) {
  let status = 0;
  fetch(URL + 'delete.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      id: id
    })
  })
  .then(res => {
    status = parseInt(res.status);
    return res.json();
  })
  .then(
    (res) => {
      if (status === 200) {
        const newItemWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newItemWithoutRemoved);
      } else {
        alert(res.error);
      }
    }
  )
}

function save(e) {
  e.preventDefault();
  let status = 0;

  if(!item){
    return;
  }

  fetch(URL + 'add.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      description: item,
      amount: amount
    })
  })
  .then(res => {
    status = parseInt(res.status);
    return res.json();
  })
  .then(
    (res) => {
      if (status = 200) {
        setItems(items => [...items, res]);
        setItem('');
        setAmount('');
      } else {
        alert(res.error)
      }
    }, (error) => {
      alert(error);
    }
  )
}

  return (
  <div>
    <h3>Kauppalista</h3>
    <div>
      <form onSubmit={save}>
        <label>New item</label>
        <input value={item} placeholder="type description" onChange={e => setItem(e.target.value)} />
        <input value={amount} placeholder="type amount" onChange={e => setAmount(e.target.value)} />
        <button>Save</button>
      </form>
      </div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.description} &nbsp; {item.amount}
          <a className="delete" onClick={() => remove(item.id)} href="#">Delete</a>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
