'use client'

import React, { useEffect, useState, useRef } from 'react';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { Loader2 } from "lucide-react"
import { HiXCircle } from "react-icons/hi";

interface HomeProps {
  // Add your prop types here
}

interface IQuestions {
  id: number;
  question?: string;
  answer?: string;
  status?: boolean;
}

const Home: React.FC<HomeProps> = () => {

  const questions:IQuestions[] = [
    { id: 1, question: 'Produk PKT yang memiliki bau yang tajam dan sifat iritan adalah amoniak. Amoniak memiliki rumus kimia…', answer: 'NH3', status: false },
    { id: 2, question: 'Alat yang berfungsi untuk melindungi kepala dari jatuhnya benda-benda asing di dalam pabrik adalah...', answer: 'SAFETY HELMET, HELM, TOPI KESELAMATAN', status: false },
    { id: 3, question: 'Kadar oksigen normal di dalam ruang terbatas yang diizinkan adalah pada interval 19,5% - 23,5%.  Berapa Nilai Ambang Batas yang diizinkan untuk paparan ammonia di area pabrik selama 8 jam adalah …. ppm', answer: '25 ppm', status: false },
    { id: 4, question: 'Alat pelindung telinga pada saat bekerja di tempat dengan tingkat kebisingan 85 - 95 dB adalah....', answer: 'EAR PLUG', status: false },
    { id: 5, question: '⁠Suatu tanda yang berada di permukaan jalan atau di atas permukaan jalan yang meliputi peralatan atau tanda yang membentuk garis membujur, garis melintang, garis serong serta lambang lainnya yang berfungsi untuk mengarahkan arus lalu lintas dan membatasi daerah kepentingan lalu lintas disebut....', answer: 'Marka jalan', status: false },
  ];

  const audioWrongRef = useRef<HTMLAudioElement>(null);
  const audioRightRef = useRef<HTMLAudioElement>(null);
  const audioRouletteRef = useRef<HTMLAudioElement>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestions>(questions[0]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  // const [usedQuestions, setUsedQuestions] = useState<IQuestions[]>([]);
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false);
  const [isBlinkingWrong, setIsBlinkingWrong] = useState<boolean>(false);

  const [listQuestion, setListQuestion] = useState<IQuestions[]>([]);

  useEffect(() => {
    const dataLocal = localStorage.getItem('questions') || '';
    const data = dataLocal ? JSON.parse(dataLocal) : [];
    setListQuestion(data);
  }, [])
  

  useEffect(() => {
    let blinkInterval: NodeJS.Timeout;

    if (isBlinkingWrong) {
      blinkInterval = setInterval(() => {
        setIsBlinkingWrong((prevIsBlinking) => !prevIsBlinking);
      }, 1000);
    }

    return () => clearInterval(blinkInterval);
  }, [isBlinkingWrong]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAnimating) {
      interval = setInterval(() => {
        const availableQuestions = listQuestion?.filter((item:IQuestions) => item.status === false) || [];

        if (availableQuestions.length < 0) {
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          const randomIndex = Math.floor(
            Math.random() * availableQuestions.length
          );
          const newQuestion = availableQuestions[randomIndex];
          setCurrentQuestion(newQuestion);
          setUserAnswer('');
        }
      }, 70);
    }

    return () => clearInterval(interval);
  }, [isAnimating, listQuestion]);

  const handleStartAnimation = () => {
    setIsAnimating(true);
    setIsShowAnswer(false);
    setIsReady(true);
    if (audioRouletteRef.current) {
      audioRouletteRef.current.play();
    }
  };

  const handleStopAnimation = () => {
    setIsAnimating(false);
    if (audioRouletteRef.current) {
      audioRouletteRef.current.pause();
      audioRouletteRef.current.currentTime = 0;
    }
  };

  const handleShowAnswer = () => {
    setIsShowAnswer(!isShowAnswer)
  }

  const handleSetQuestion = () => {
    const indexToUpdate = listQuestion.findIndex((item: { id: number }) => item.id === currentQuestion.id);

    if (indexToUpdate !== -1) {
      listQuestion[indexToUpdate] = {
        ...listQuestion[indexToUpdate],
        status: true,
      };

      localStorage.setItem('questions', JSON.stringify(listQuestion));
    }
  };

  const handleAnswerTrue = () => {
    setIsShowAnswer(true);
    confetti({
      particleCount: 300,
      spread: 220,
      origin: { y: 0.6 }
    });
    if (audioRightRef.current) {
      audioRightRef.current.play();
    }
    handleSetQuestion();
  }

  const handleAnswerFalse = () => {
    setIsBlinkingWrong(true);
    if (audioWrongRef.current) {
      audioWrongRef.current.play();
    }
  }

  const handleAnswerToLocalStorage = () => {
    const data = JSON.stringify(questions);
    localStorage.setItem('questions', data)
  }


  return (
    <Layout title="Home">
      <div className='max-w-screen-xl mx-auto px-4'>
        {/* <h1 className='p-4 pt-12 text-4xl font-bold text-center'>Babak Ke-1</h1> */}
        <div className='pt-4 pb-4'>
          <div className='mt-3'>
            <div className='bg-gray-100 rounded-2xl p-8 h-[18em] border-4'>
              <h1 className='text-2xl font-semibold text-blue-700 pb-2 text-center'>Question</h1>
              <div className='text-center'>
                {isReady && 
                  <span className='text-4xl'>{currentQuestion?.question || 'Soal Habis'}</span>
                || null}
              </div>
            </div>
          </div>
          <div className='mt-8'>
            <div className={`${isBlinkingWrong ? 'bg-red-200' : 'bg-blue-100'} rounded-2xl p-8 h-[14em]`}>
            <h1 className='text-2xl font-semibold text-blue-700 pb-2 text-center'>Answer</h1>
              {isShowAnswer && 
                <div className='text-center'>
                  <span className='text-4xl font-semibold'>{currentQuestion.answer}</span>
                </div>
              || null}
              {isBlinkingWrong ?
                <div className='text-center pt-3 text-red-700'>
                  <div className='flex justify-center'>
                    <HiXCircle size={150} className='' />
                  </div>
                </div>
              : null}
            </div>
          </div>

          <div className='flex pt-[4em]'>
            <div className='py-3 flex ml-auto gap-6'>
              <Button onClick={handleAnswerToLocalStorage} className='text-xl'>Set Question</Button>
              <Link href='/questions'>
                <Button className='mr-[5em] text-xl' variant={`outline`}>Questions</Button>
              </Link>
              <Button disabled={isAnimating} onClick={handleStartAnimation} className='text-xl'>
                {isAnimating &&
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                || null}
                Acak Soal
              </Button>
              <audio ref={audioRouletteRef} src="/roulette.mp3" />
              <Button disabled={!isAnimating} onClick={handleStopAnimation} variant={`destructive`} className='text-xl'>Stop</Button>
            </div>
          </div>
          <div className='flex gap-6 mt-5'>
            <div className='py-3 flex ml-auto gap-[8em]'>
              <Button disabled={isAnimating} onClick={handleAnswerTrue} variant={`success`} className='text-xl'>Benar</Button>
              <audio ref={audioRightRef} src="/right.mp3" />
              <Button disabled={isAnimating} onClick={handleAnswerFalse} className='text-xl' variant={`destructive`}>Salah</Button>
              <audio ref={audioWrongRef} src="/wrong.mp3" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;