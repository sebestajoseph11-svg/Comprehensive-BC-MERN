import { Link } from 'react-router-dom';
import { categories } from '../../config/games';
import Icon from '../icons/Icon';

export default function CategoryRow() {
  return (
    <div className="cats">
      {categories.map((item) => (
        <Link key={item.id} to={item.path} className="cat-card">
          <span>{item.label}</span>
          <Icon name={item.icon} size={42} />
        </Link>
      ))}
    </div>
  );
}
