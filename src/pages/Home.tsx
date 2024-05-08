import { useEffect, useState } from 'react';
import SmoothieCard from '../components/SmoothieCard';
import { supabase } from '../config/supabaseClient';
import { SmoothiesProps } from '../types';

const Home = () => {
  const [fectchError, setFectchError] = useState<string | null>(null);
  const [smoothies, setSmoothies] = useState<SmoothiesProps[]>([]);
  const [orderBy, setOrderBy] = useState('created_at');

  const handleDelete = (id: SmoothiesProps['id']) => {
    setSmoothies(smoothies.filter(smoothie => smoothie.id !== id));
  };

  useEffect(() => {
    getSmoothies();
  }, [orderBy]);

  const getSmoothies = async () => {
    const { data, error } = await supabase.from('smoothies').select().order(orderBy,{ascending:false});

    if (error) {
      setFectchError('Could not fecth data');
      setFectchError(null);
      console.log(error);
    }

    if (data) {
      setSmoothies(data);
      setFectchError(null);
    }
  };

  return (
    <div className='page home'>
      {fectchError && <p>{fectchError}</p>}
      {smoothies && (
        <div className='smoothies'>
          <div className='order-by'>
            <p>Order by:</p>
            <button onClick={() => setOrderBy('created_at')}>
              Time Created
            </button>
            <button onClick={() => setOrderBy('title')}>Title</button>
            <button onClick={() => setOrderBy('rating')}>Rating</button>
            {orderBy}
          </div>
          <div className='smoothie-grid'>
            {smoothies.map(smoothie => (
              <SmoothieCard
                smoothie={smoothie}
                key={smoothie.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
