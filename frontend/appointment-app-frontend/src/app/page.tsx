import Image from "next/image";
import styles from "./page.module.css";
import LikeButton from './like-button';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header title='Appointment app'/>
      <Body />
    </main>
  );
}


function Header({ title }) {
  return (
    <h1>{title ? title : 'Default title'}</h1>
  )
}

function Body() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
  return (
    <div>
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <LikeButton />
    </div>
  );
}