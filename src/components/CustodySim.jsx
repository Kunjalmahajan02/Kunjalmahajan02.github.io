import { useReducer } from 'react';

// A small in-browser model of ChainTrack.sol's rules. Each action runs the
// same checks, in the same order, with the same revert messages as the
// contract — but nothing touches a blockchain or a wallet.

const ROLES = ['None', 'Manufacturer', 'Distributor', 'Retailer'];
const ACCOUNTS = [1, 2, 3, 4, 5];

const initial = () => ({
  actor: 2,
  roles: { 1: 'None', 2: 'Manufacturer', 3: 'Distributor', 4: 'Retailer', 5: 'None' },
  products: {},
  nextId: 1,
  log: [{ ok: true, text: 'Contract deployed by Account 1 (admin). Roles assigned to Accounts 2–4.' }],
});

class Revert extends Error {}
const require = (cond, msg) => {
  if (!cond) throw new Revert(msg);
};

function reducer(state, action) {
  if (action.type === 'actor') return { ...state, actor: action.actor };
  if (action.type === 'reset') return initial();

  const { actor, roles, products } = state;
  const who = `Account ${actor}`;
  try {
    switch (action.type) {
      case 'register': {
        require(roles[actor] === 'Manufacturer', 'Manufacturer only');
        const id = state.nextId;
        const product = { id, name: 'Organic Rice', batch: `Batch-00${id}`, owner: actor, history: [actor] };
        return {
          ...state,
          nextId: id + 1,
          products: { ...products, [id]: product },
          log: [{ ok: true, text: `${who}: registerProduct → product #${id} “Organic Rice”, ${product.batch}. Event ProductRegistered.` }, ...state.log],
        };
      }
      case 'transfer': {
        const { id, to } = action;
        require(roles[actor] !== 'None', 'Not an authorized participant');
        const p = products[id];
        require(p, 'Product not found');
        require(p.owner === actor, 'Not current owner');
        require(to !== actor, 'Already the owner');
        require(roles[to] !== 'None', 'Recipient not authorized');
        const updated = { ...p, owner: to, history: [...p.history, to] };
        return {
          ...state,
          products: { ...products, [id]: updated },
          log: [{ ok: true, text: `${who}: transferProduct(#${id} → Account ${to}). Event OwnershipTransferred.` }, ...state.log],
        };
      }
      case 'setRole': {
        const { user, role } = action;
        require(actor === 1, 'Admin only');
        require(role !== 'None', 'Invalid role');
        return {
          ...state,
          roles: { ...roles, [user]: role },
          log: [{ ok: true, text: `${who}: setRole(Account ${user}, ${role}). Event RoleAssigned.` }, ...state.log],
        };
      }
      default:
        return state;
    }
  } catch (err) {
    if (!(err instanceof Revert)) throw err;
    return { ...state, log: [{ ok: false, text: `${who}: reverted — “${err.message}”` }, ...state.log] };
  }
}

export default function CustodySim() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const productIds = Object.keys(state.products).map(Number);

  const submitTransfer = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    dispatch({ type: 'transfer', id: Number(f.get('product')), to: Number(f.get('to')) });
  };
  const submitRole = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    dispatch({ type: 'setRole', user: Number(f.get('user')), role: f.get('role') });
  };

  return (
    <div className="sim">
      <p className="sim__note">
        <span className="mono">SIMULATION</span> An in-browser model of the contract’s rules, using the same checks and
        revert messages as <code>ChainTrack.sol</code>. No blockchain, wallet or network is involved.
      </p>

      <fieldset className="sim__actors">
        <legend className="mono">ACTING AS</legend>
        {ACCOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={state.actor === a}
            onClick={() => dispatch({ type: 'actor', actor: a })}
          >
            <span className="sim__acct">Account {a}</span>
            <span className="mono sim__role">{a === 1 ? 'Admin' : state.roles[a] === 'None' ? 'No role' : state.roles[a]}</span>
          </button>
        ))}
      </fieldset>

      <div className="sim__actions">
        <div className="sim__action">
          <p className="mono">registerProduct</p>
          <button type="button" className="btn btn--small" onClick={() => dispatch({ type: 'register' })}>
            Register “Organic Rice”
          </button>
        </div>

        <form className="sim__action" onSubmit={submitTransfer}>
          <p className="mono">transferProduct</p>
          <div className="sim__fields">
            <label>
              Product
              <select name="product" disabled={productIds.length === 0}>
                {productIds.length === 0 && <option>none yet</option>}
                {productIds.map((id) => (
                  <option key={id} value={id}>
                    #{id}
                  </option>
                ))}
              </select>
            </label>
            <label>
              To
              <select name="to" defaultValue={3}>
                {ACCOUNTS.map((a) => (
                  <option key={a} value={a}>
                    Account {a}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn--small" disabled={productIds.length === 0}>
            Transfer
          </button>
        </form>

        <form className="sim__action" onSubmit={submitRole}>
          <p className="mono">setRole</p>
          <div className="sim__fields">
            <label>
              Account
              <select name="user" defaultValue={5}>
                {ACCOUNTS.map((a) => (
                  <option key={a} value={a}>
                    Account {a}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Role
              <select name="role" defaultValue="Retailer">
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn--small">
            Assign role
          </button>
        </form>
      </div>

      <div className="sim__out">
        <div>
          <p className="mono sim__out-head">LEDGER</p>
          {productIds.length === 0 ? (
            <p className="empty-note">No products yet. Act as Account 2 (Manufacturer) and register one.</p>
          ) : (
            <ul className="sim__ledger">
              {productIds.map((id) => {
                const p = state.products[id];
                return (
                  <li key={id}>
                    <strong>
                      #{id} {p.name}
                    </strong>{' '}
                    <span className="mono">{p.batch}</span>
                    <span className="sim__chain">
                      {p.history.map((h, i) => (
                        <span key={i}>
                          {i > 0 && <span aria-hidden="true"> → </span>}
                          <span className="visually-hidden">{i > 0 ? 'then ' : ''}</span>Acct {h}
                        </span>
                      ))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div>
          <div className="sim__out-row">
            <p className="mono sim__out-head">TRANSACTION LOG</p>
            <button type="button" className="link-button" onClick={() => dispatch({ type: 'reset' })}>
              Reset
            </button>
          </div>
          <ol className="sim__log" aria-live="polite">
            {state.log.slice(0, 8).map((l, i) => (
              <li key={state.log.length - i} className={l.ok ? 'ok' : 'bad'}>
                <span className="mono">{l.ok ? 'OK' : 'REVERT'}</span> {l.text}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
