import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Wallet,
  ArrowRightLeft,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  Users,
  UserPlus,
  RefreshCw,
  Sparkles,
  AlertCircle,
  History,
  ArrowRight,
  Landmark,
  Check,
  Download,
  Upload,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Gift,
  BookOpen,
  SlidersHorizontal,
  Trophy,
  CheckCheck
} from 'lucide-react';

// ==========================================
// カスタムSVGアイコン（赤×白のリアコイン & 赤×ゴールドのプレミアムリアコイン）
// ==========================================
const RiaCoinSvg = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="riaRedOuter" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
      <linearGradient id="riaRedInner" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BE123C" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="29" fill="url(#riaRedOuter)" stroke="#FFE4E6" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="22" fill="url(#riaRedInner)" stroke="#FDA4AF" strokeWidth="1.5" strokeDasharray="4 2" />
    <path
      d="M25 42V22H33.5C37.5 22 40 24.2 40 27.8C40 30.8 38.1 32.8 35.1 33.4L41 42H36L30.8 34H29.5V42H25ZM29.5 30.2H33.2C35.1 30.2 36.2 29.3 36.2 27.8C36.2 26.3 35.1 25.5 33.2 25.5H29.5V30.2Z"
      fill="#FFFFFF"
    />
    <circle cx="47" cy="17" r="2.5" fill="#FFFFFF" />
    <circle cx="17" cy="45" r="1.5" fill="#FECDD3" />
  </svg>
);

const PremiumRiaCoinSvg = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="premGoldOuter" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="premRubyInner" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="29" fill="url(#premGoldOuter)" stroke="#FEF9C3" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="22.5" fill="url(#premRubyInner)" stroke="#FDE047" strokeWidth="1.8" />
    <path
      d="M21 38L18 23L26.5 29L32 20L37.5 29L46 23L43 38H21Z"
      fill="#FEF08A"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <rect x="21" y="40.5" width="22" height="3.5" rx="1.75" fill="#FDE047" />
    <circle cx="32" cy="15.5" r="2" fill="#FFFFFF" />
    <circle cx="16" cy="20" r="1.8" fill="#FEF9C3" />
    <circle cx="48" cy="20" r="1.8" fill="#FEF9C3" />
  </svg>
);

// ==========================================
// 初期データ・プリセット定義
// ==========================================
const STORAGE_KEY = 'ria_bank_white_red_v3';

const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'リスナーA（あおぞら）',
    handle: '@aozora_fan',
    avatarColor: 'from-rose-500 to-red-600',
    riaCoin: 2500,
    premiumRiaCoin: 25,
  },
  {
    id: 'user-2',
    name: 'リスナーB（ひなた）',
    handle: '@hinata_support',
    avatarColor: 'from-red-500 to-amber-500',
    riaCoin: 5400,
    premiumRiaCoin: 80,
  },
  {
    id: 'user-3',
    name: 'リスナーC（ルナ）',
    handle: '@luna_starlight',
    avatarColor: 'from-pink-500 to-rose-600',
    riaCoin: 980,
    premiumRiaCoin: 12,
  },
];

const INITIAL_REQUESTS = [
  {
    id: 'req-101',
    userId: 'user-1',
    userName: 'リスナーA（あおぞら）',
    type: 'INCREASE',
    currency: 'RIA',
    amount: 500,
    note: '配信企画ビンゴ大会1位達成ボーナス！',
    status: 'PENDING',
    createdAt: '2026-11-18 21:30',
  },
  {
    id: 'req-102',
    userId: 'user-2',
    userName: 'リスナーB（ひなた）',
    type: 'CONVERT',
    currency: 'PREMIUM',
    amount: 10,
    rateAtRequest: 100,
    convertedAmount: 1000,
    note: 'ガチャ企画参加用にプレミアム10枚をリアコインへ変換希望',
    status: 'PENDING',
    createdAt: '2026-11-18 22:15',
  },
  {
    id: 'req-103',
    userId: 'user-3',
    userName: 'リスナーC（ルナ）',
    type: 'USE',
    currency: 'PREMIUM',
    amount: 5,
    note: '【VIP特典】個別お名前呼びお礼ボイスと交換',
    status: 'PENDING',
    createdAt: '2026-11-19 00:05',
  },
  {
    id: 'req-100',
    userId: 'user-1',
    userName: 'リスナーA（あおぞら）',
    type: 'USE',
    currency: 'RIA',
    amount: 300,
    note: '特製アイコンリング（11月限定デザイン）交換',
    status: 'APPROVED',
    createdAt: '2026-11-16 19:45',
    processedAt: '2026-11-16 20:10',
  },
  {
    id: 'req-099',
    userId: 'user-1',
    userName: 'リスナーA（あおぞら）',
    type: 'INCREASE',
    currency: 'PREMIUM',
    amount: 10,
    note: '月間ギフトランキングTOP3入賞特典',
    status: 'APPROVED',
    createdAt: '2026-11-15 18:00',
    processedAt: '2026-11-15 18:30',
  },
];

const INITIAL_SETTINGS = {
  conversionRate: 100, // 1 プレミアムリアコイン = 100 リアコイン
  liverPassword: '0000', // 初期パスワード
};

// 獲得報告（増額申請）用クイックプリセット
const INCREASE_PRESETS = [
  { label: '配信視聴・皆勤ボーナス', currency: 'RIA', amount: 100, note: '配信皆勤・視聴ミッション達成ボーナス' },
  { label: '企画・ゲーム達成報酬', currency: 'RIA', amount: 500, note: '配信内企画・参加ミッション達成報酬' },
  { label: 'ギフト応援特典 (RC)', currency: 'RIA', amount: 1000, note: '指定ギフト応援キャンペーン特典' },
  { label: 'VIPランキング特典 (PRC)', currency: 'PREMIUM', amount: 5, note: '月間応援ランキング上位入賞VIP特典' },
];

// 特典利用（減額申請）用クイックプリセット
const USE_PRESETS = [
  { label: '限定アイコンリング', currency: 'RIA', amount: 300, note: '【特典交換】特製アイコンリング受け取り' },
  { label: '1曲リクエスト歌唱', currency: 'RIA', amount: 500, note: '【特典交換】配信内リクエスト曲1曲フル歌唱' },
  { label: '手書きデジタルメッセージ', currency: 'RIA', amount: 1000, note: '【特典交換】お名前入り手書きメッセージ画像' },
  { label: '個別お礼ボイス (VIP)', currency: 'PREMIUM', amount: 5, note: '【VIP特典】個別シチュエーション・お礼ボイス' },
  { label: '1on1トーク5分券 (VIP)', currency: 'PREMIUM', amount: 15, note: '【VIP特典】プレミアム個別トーク5分チケット' },
];

const AVATAR_GRADIENTS = [
  'from-rose-500 to-red-600',
  'from-red-500 to-amber-500',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-rose-600 to-pink-700',
];

// ==========================================
// メインコンポーネント
// ==========================================
export default function App() {
  // モード管理 ('LISTENER' | 'LIVER')
  const [role, setRole] = useState('LISTENER');
  // ライバー認証状態（セッション中のロック解除状態）
  const [isLiverUnlocked, setIsLiverUnlocked] = useState(false);
  // パスワード入力モーダル表示
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassText, setShowPassText] = useState(false);
  const [authError, setAuthError] = useState('');

  // 現在選択中のリスナーID
  const [activeUserId, setActiveUserId] = useState('user-1');

  // 永続化ステート
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.users) && parsed.users.length > 0) return parsed.users;
      }
    } catch (e) {
      console.error('Failed to load users', e);
    }
    return INITIAL_USERS;
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.requests)) return parsed.requests;
      }
    } catch (e) {
      console.error('Failed to load requests', e);
    }
    return INITIAL_REQUESTS;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) {
          return {
            conversionRate: parsed.settings.conversionRate || 100,
            liverPassword: parsed.settings.liverPassword || '0000',
          };
        }
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    return INITIAL_SETTINGS;
  });

  // モーダル・通知ステート
  const [toast, setToast] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserHandle, setNewUserHandle] = useState('');
  const [newUserInitRia, setNewUserInitRia] = useState('0');
  const [newUserInitPrem, setNewUserInitPrem] = useState('0');

  const fileInputRef = useRef(null);

  // LocalStorage への自動保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ users, requests, settings }));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  }, [users, requests, settings]);

  // 通知表示ヘルパー
  const notify = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3400 ? null : prev));
    }, 3500);
  };

  // 現在選択中のリスナー
  const activeUser = useMemo(
    () => users.find((u) => u.id === activeUserId) || users[0],
    [users, activeUserId]
  );

  // 現在時刻フォーマット
  const getFormattedNow = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
  };

  // ==========================================
  // パスワード認証・モード切替ハンドラ
  // ==========================================
  const handleTryEnterLiverMode = () => {
    if (isLiverUnlocked) {
      setRole('LIVER');
    } else {
      setPasswordInput('');
      setAuthError('');
      setShowAuthModal(true);
    }
  };

  const handleVerifyPassword = (e) => {
    e.preventDefault();
    const currentPass = settings.liverPassword || '0000';
    if (passwordInput === currentPass) {
      setIsLiverUnlocked(true);
      setRole('LIVER');
      setShowAuthModal(false);
      setPasswordInput('');
      setAuthError('');
      notify('ライバー管理モードのロックを解除しました。', 'success');
    } else {
      setAuthError('パスワードが正しくありません。');
    }
  };

  const handleLockLiverMode = () => {
    setIsLiverUnlocked(false);
    setRole('LISTENER');
    notify('ライバー管理画面をロックし、リスナー画面に戻りました。', 'info');
  };

  const handleUpdatePassword = (newPassword) => {
    const trimmed = newPassword.trim();
    if (trimmed.length < 2) {
      notify('パスワードは2文字以上で設定してください。', 'error');
      return false;
    }
    setSettings((prev) => ({ ...prev, liverPassword: trimmed }));
    notify('ライバー認証用パスワードを更新しました！', 'success');
    return true;
  };

  // ==========================================
  // 銀行アクションハンドラ
  // ==========================================

  // 新規リスナー追加
  const handleAddListener = (e) => {
    e.preventDefault();
    const trimmedName = newUserName.trim();
    if (!trimmedName) {
      notify('リスナー名を入力してください。', 'error');
      return;
    }
    const initRia = Math.max(0, parseInt(newUserInitRia, 10) || 0);
    const initPrem = Math.max(0, parseInt(newUserInitPrem, 10) || 0);
    const formattedHandle = newUserHandle.trim()
      ? newUserHandle.trim().startsWith('@')
        ? newUserHandle.trim()
        : `@${newUserHandle.trim()}`
      : `@listener_${users.length + 1}`;

    const newUser = {
      id: `user-${Date.now()}`,
      name: trimmedName,
      handle: formattedHandle,
      avatarColor: AVATAR_GRADIENTS[users.length % AVATAR_GRADIENTS.length],
      riaCoin: initRia,
      premiumRiaCoin: initPrem,
    };

    setUsers((prev) => [...prev, newUser]);
    setActiveUserId(newUser.id);
    setNewUserName('');
    setNewUserHandle('');
    setNewUserInitRia('0');
    setNewUserInitPrem('0');
    setShowAddUserModal(false);
    notify(`新規リスナー「${newUser.name}」の口座を開設しました！`, 'success');
  };

  // リスナーからの新規申請作成
  const handleCreateRequest = ({ type, currency, amount, note }) => {
    if (!activeUser) return false;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount <= 0 || !Number.isInteger(numAmount)) {
      notify('1以上の整数を入力してください。', 'error');
      return false;
    }

    if (type === 'USE') {
      const currentBal =
        currency === 'RIA' ? activeUser.riaCoin : activeUser.premiumRiaCoin;
      if (numAmount > currentBal) {
        notify('保有残高を超える利用申請はできません。', 'error');
        return false;
      }
    }

    if (type === 'CONVERT') {
      if (numAmount > activeUser.premiumRiaCoin) {
        notify('プレミアムリアコインの保有残高が不足しています。', 'error');
        return false;
      }
    }

    const newReq = {
      id: `req-${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      type,
      currency: type === 'CONVERT' ? 'PREMIUM' : currency,
      amount: numAmount,
      ...(type === 'CONVERT'
        ? {
            rateAtRequest: settings.conversionRate,
            convertedAmount: numAmount * settings.conversionRate,
          }
        : {}),
      note:
        note.trim() ||
        (type === 'CONVERT'
          ? `プレミアムリアコイン ${numAmount}枚をリアコインへ変換`
          : type === 'INCREASE'
          ? 'コイン獲得・増額申請'
          : '特典交換・コイン利用申請'),
      status: 'PENDING',
      createdAt: getFormattedNow(),
    };

    setRequests((prev) => [newReq, ...prev]);
    notify('申請を提出しました！ライバーの承認をお待ちください。', 'success');
    return true;
  };

  // ライバーによる単一申請の承認・却下
  const handleProcessRequest = (requestId, decision) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq || targetReq.status !== 'PENDING') return;

    if (decision === 'REJECTED') {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: 'REJECTED', processedAt: getFormattedNow() }
            : r
        )
      );
      notify(`${targetReq.userName} の申請を却下しました。`, 'info');
      return;
    }

    const targetUser = users.find((u) => u.id === targetReq.userId);
    if (!targetUser) {
      notify('対象リスナーが見つかりません。', 'error');
      return;
    }

    // 残高チェック
    if (targetReq.type === 'USE') {
      const currentBal =
        targetReq.currency === 'RIA'
          ? targetUser.riaCoin
          : targetUser.premiumRiaCoin;
      if (targetReq.amount > currentBal) {
        notify(
          `残高不足のため承認できません（現在残高: ${currentBal.toLocaleString()}）`,
          'error'
        );
        return;
      }
    }

    if (targetReq.type === 'CONVERT') {
      if (targetReq.amount > targetUser.premiumRiaCoin) {
        notify(
          `プレミアムリアコイン残高不足のため承認できません（現在残高: ${targetUser.premiumRiaCoin.toLocaleString()}）`,
          'error'
        );
        return;
      }
    }

    // 残高の更新
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id !== targetReq.userId) return u;

        if (targetReq.type === 'INCREASE') {
          return targetReq.currency === 'RIA'
            ? { ...u, riaCoin: u.riaCoin + targetReq.amount }
            : { ...u, premiumRiaCoin: u.premiumRiaCoin + targetReq.amount };
        }
        if (targetReq.type === 'USE') {
          return targetReq.currency === 'RIA'
            ? { ...u, riaCoin: u.riaCoin - targetReq.amount }
            : { ...u, premiumRiaCoin: u.premiumRiaCoin - targetReq.amount };
        }
        if (targetReq.type === 'CONVERT') {
          const gainedRia =
            targetReq.convertedAmount ||
            targetReq.amount * (targetReq.rateAtRequest || settings.conversionRate);
          return {
            ...u,
            premiumRiaCoin: u.premiumRiaCoin - targetReq.amount,
            riaCoin: u.riaCoin + gainedRia,
          };
        }
        return u;
      })
    );

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'APPROVED', processedAt: getFormattedNow() }
          : r
      )
    );

    notify(`${targetReq.userName} の申請を承認し、銀行残高に反映しました！`, 'success');
  };

  // ライバーによる承認待ち一括承認
  const handleBulkApprove = () => {
    const pendingList = requests.filter((r) => r.status === 'PENDING');
    if (pendingList.length === 0) return;

    const updatedUsersMap = {};
    users.forEach((u) => {
      updatedUsersMap[u.id] = { ...u };
    });

    const approvedIds = new Set();
    let skippedCount = 0;

    [...pendingList].reverse().forEach((req) => {
      const u = updatedUsersMap[req.userId];
      if (!u) {
        skippedCount++;
        return;
      }

      if (req.type === 'INCREASE') {
        if (req.currency === 'RIA') u.riaCoin += req.amount;
        else u.premiumRiaCoin += req.amount;
        approvedIds.add(req.id);
      } else if (req.type === 'USE') {
        const bal = req.currency === 'RIA' ? u.riaCoin : u.premiumRiaCoin;
        if (bal >= req.amount) {
          if (req.currency === 'RIA') u.riaCoin -= req.amount;
          else u.premiumRiaCoin -= req.amount;
          approvedIds.add(req.id);
        } else {
          skippedCount++;
        }
      } else if (req.type === 'CONVERT') {
        if (u.premiumRiaCoin >= req.amount) {
          const gained =
            req.convertedAmount ||
            req.amount * (req.rateAtRequest || settings.conversionRate);
          u.premiumRiaCoin -= req.amount;
          u.riaCoin += gained;
          approvedIds.add(req.id);
        } else {
          skippedCount++;
        }
      }
    });

    const nowStr = getFormattedNow();
    setUsers(Object.values(updatedUsersMap));
    setRequests((prev) =>
      prev.map((r) =>
        approvedIds.has(r.id) ? { ...r, status: 'APPROVED', processedAt: nowStr } : r
      )
    );

    if (skippedCount > 0) {
      notify(
        `${approvedIds.size}件を一括承認しました（残高不足の${skippedCount}件は保留）。`,
        'info'
      );
    } else {
      notify(`承認待ちの申請 ${approvedIds.size}件 をすべて一括承認しました！`, 'success');
    }
  };

  // ライバーからの直接残高調整
  const handleDirectAdjust = ({ userId, currency, operation, amount, reason }) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !Number.isInteger(numAmount)) {
      notify('1以上の整数を入力してください。', 'error');
      return false;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return false;

    if (operation === 'SUBTRACT') {
      const bal =
        currency === 'RIA' ? targetUser.riaCoin : targetUser.premiumRiaCoin;
      if (numAmount > bal) {
        notify('保有残高を超える減算はできません。', 'error');
        return false;
      }
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const delta = operation === 'ADD' ? numAmount : -numAmount;
        return currency === 'RIA'
          ? { ...u, riaCoin: u.riaCoin + delta }
          : { ...u, premiumRiaCoin: u.premiumRiaCoin + delta };
      })
    );

    const logRecord = {
      id: `direct-${Date.now()}`,
      userId: targetUser.id,
      userName: targetUser.name,
      type: operation === 'ADD' ? 'INCREASE' : 'USE',
      currency,
      amount: numAmount,
      note: `【ライバー直接操作】${reason.trim() || (operation === 'ADD' ? '特別ボーナス付与' : '残高調整')}`,
      status: 'APPROVED',
      createdAt: getFormattedNow(),
      processedAt: getFormattedNow(),
    };
    setRequests((prev) => [logRecord, ...prev]);

    notify(
      `${targetUser.name} の残高を直接${operation === 'ADD' ? '付与' : '減算'}しました。`,
      'success'
    );
    return true;
  };

  // 変換レート設定変更
  const handleUpdateRate = (newRate) => {
    const parsed = Number(newRate);
    if (isNaN(parsed) || parsed < 1 || parsed > 100000 || !Number.isInteger(parsed)) {
      notify('変換レートは1〜100,000の整数で設定してください。', 'error');
      return;
    }
    setSettings((prev) => ({ ...prev, conversionRate: parsed }));
    notify(`変換レートを「1 プレミアム = ${parsed.toLocaleString()} リアコイン」に更新しました！`, 'success');
  };

  // JSONバックアップ出力
  const handleExportJSON = () => {
    const backupData = {
      app: 'RiaBank',
      exportedAt: getFormattedNow(),
      users,
      requests,
      settings,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riabank_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('バックアップ用JSONファイルを保存しました。', 'success');
  };

  // JSONバックアップ読込
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.users) && Array.isArray(parsed.requests)) {
          setUsers(parsed.users);
          setRequests(parsed.requests);
          if (parsed.settings) {
            setSettings({
              conversionRate: parsed.settings.conversionRate || 100,
              liverPassword: parsed.settings.liverPassword || '0000',
            });
          }
          if (parsed.users[0]) setActiveUserId(parsed.users[0].id);
          notify('バックアップデータを正常に復元しました！', 'success');
        } else {
          notify('無効なバックアップファイル形式です。', 'error');
        }
      } catch (err) {
        notify('JSONファイルの読み込みに失敗しました。', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 初期データリセット
  const handleResetAll = () => {
    setUsers(INITIAL_USERS);
    setRequests(INITIAL_REQUESTS);
    setSettings(INITIAL_SETTINGS);
    setActiveUserId('user-1');
    setIsLiverUnlocked(false);
    setRole('LISTENER');
    localStorage.removeItem(STORAGE_KEY);
    setShowResetConfirm(false);
    notify('すべてのデータを初期状態にリセットしました。', 'info');
  };

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === 'PENDING').length,
    [requests]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-rose-500/20 selection:text-rose-800 pb-16">
      {/* 白基調に映える淡いレッド＆ローズの背景アクセント */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-36 -left-36 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
        <div className="absolute top-16 right-0 w-[28rem] h-[28rem] bg-red-100/50 rounded-full blur-3xl" />
      </div>

      {/* トースト通知 */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full px-4 sm:px-0">
          <div
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl border transition-all ${
              toast.type === 'error'
                ? 'bg-rose-600 border-rose-700 text-white'
                : toast.type === 'info'
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-rose-200 text-slate-900 shadow-rose-500/10'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-white shrink-0" />
            ) : toast.type === 'info' ? (
              <Sparkles className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="text-sm font-bold leading-snug">{toast.message}</p>
          </div>
        </div>
      )}

      {/* ==========================================
          ライバー管理画面 パスワード認証モーダル
         ========================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-rose-100 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    ライバー専用・管理者認証
                  </h3>
                  <p className="text-xs text-slate-500">
                    リスナーの誤操作防止のためロックされています
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    ライバー暗証番号 / パスワード
                  </label>
                  <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-semibold">
                    初期値: 0000
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassText ? 'text' : 'password'}
                    required
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="パスワードを入力"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-base font-bold text-slate-900 tracking-widest outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassText((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassText ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {authError && (
                  <p className="mt-1.5 text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {authError}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/25 flex items-center gap-1.5 transition"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>ロック解除して管理画面へ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 新規リスナー追加モーダル */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">新規リスナー口座開設</h3>
                  <p className="text-xs text-slate-500">新しいリスナーアカウントを登録します</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddListener} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  リスナー名（必須）
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="例：リスナーD（こはる）"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  アカウントID / ハンドル（任意）
                </label>
                <input
                  type="text"
                  value={newUserHandle}
                  onChange={(e) => setNewUserHandle(e.target.value)}
                  placeholder="例：@koharu_music"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-rose-600 mb-1.5">
                    初期リアコイン (RC)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newUserInitRia}
                    onChange={(e) => setNewUserInitRia(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-600 mb-1.5">
                    初期プレミアム (PRC)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newUserInitPrem}
                    onChange={(e) => setNewUserInitPrem(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/25 transition"
                >
                  口座を開設する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* リセット確認モーダル */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <RefreshCw className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-slate-900">初期データにリセット</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              すべてのリスナー残高、申請履歴、変換レート、およびパスワード設定（初期値 0000）を初期サンプル状態に戻します。よろしいですか？
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                キャンセル
              </button>
              <button
                onClick={handleResetAll}
                className="px-4 py-2 rounded-xl text-sm font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition"
              >
                リセット実行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 隠しファイル入力（JSON復元用） */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImportJSON}
        className="hidden"
      />

      {/* ==========================================
          ヘッダー（白×赤デザイン & パスワード保護付きモード切替）
         ========================================== */}
      <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* ロゴ・ブランド */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center shadow-md shadow-rose-500/25">
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                      Ria<span className="text-rose-600">Bank</span>
                    </h1>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      Official Coin Bank
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    リアコイン・プレミアムリアコイン公式通帳システム
                  </p>
                </div>
              </div>

              {/* モバイル用データ操作群 */}
              <div className="flex md:hidden items-center gap-1.5">
                <button
                  onClick={handleExportJSON}
                  title="JSONバックアップ保存"
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="JSONバックアップ復元"
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  title="初期状態にリセット"
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* モード切替 & PC用バックアップツール */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* リスナー / ライバー 切替セグメント */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 w-full sm:w-auto">
                <button
                  onClick={() => setRole('LISTENER')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    role === 'LISTENER'
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/25'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>リスナー画面</span>
                </button>

                <button
                  onClick={handleTryEnterLiverMode}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all relative ${
                    role === 'LIVER'
                      ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-md shadow-rose-500/25'
                      : 'text-slate-600 hover:text-rose-600'
                  }`}
                >
                  {isLiverUnlocked ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  <span>ライバー管理</span>
                  {pendingCount > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 text-[11px] font-black rounded-full ${
                        role === 'LIVER'
                          ? 'bg-white text-rose-600'
                          : 'bg-rose-600 text-white animate-pulse'
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>

              {/* ライバーモード時の即時ロックボタン */}
              {isLiverUnlocked && (
                <button
                  onClick={handleLockLiverMode}
                  title="ライバー画面をロックする"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ロック</span>
                </button>
              )}

              {/* PC用バックアップ・復元・リセットボタン */}
              <div className="hidden md:flex items-center gap-1.5">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-sm"
                  title="データをJSONファイルとして保存"
                >
                  <Download className="w-3.5 h-3.5 text-rose-600" />
                  <span>保存</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-sm"
                  title="保存したJSONファイルから復元"
                >
                  <Upload className="w-3.5 h-3.5 text-rose-600" />
                  <span>復元</span>
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-600 transition shadow-sm"
                  title="初期状態に戻す"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* アカウント切り替えバー */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
              <Users className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {role === 'LISTENER' ? '表示中のリスナー口座：' : 'リスナー口座クイック切替：'}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {users.map((u) => {
                const isSelected = u.id === activeUser?.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setActiveUserId(u.id);
                      if (role === 'LIVER') setRole('LISTENER');
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition shrink-0 ${
                      isSelected && role === 'LISTENER'
                        ? 'bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected && role === 'LISTENER'
                          ? 'bg-white'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>{u.name}</span>
                    <span
                      className={`text-[10px] font-mono font-extrabold ${
                        isSelected && role === 'LISTENER'
                          ? 'text-rose-100'
                          : 'text-rose-600'
                      }`}
                    >
                      {u.riaCoin.toLocaleString()}RC
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>＋新規リスナー追加</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          メインコンテンツ
         ========================================== */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {role === 'LISTENER' ? (
          <ListenerDashboard
            user={activeUser}
            requests={requests.filter((r) => r.userId === activeUser.id)}
            conversionRate={settings.conversionRate}
            onCreateRequest={handleCreateRequest}
          />
        ) : (
          <LiverDashboard
            users={users}
            requests={requests}
            settings={settings}
            onProcessRequest={handleProcessRequest}
            onBulkApprove={handleBulkApprove}
            onDirectAdjust={handleDirectAdjust}
            onUpdateRate={handleUpdateRate}
            onUpdatePassword={handleUpdatePassword}
            onLockLiver={handleLockLiverMode}
            onOpenAddUser={() => setShowAddUserModal(true)}
          />
        )}
      </main>
    </div>
  );
}

// ==========================================
// リスナー側ダッシュボード（白×赤デザイン）
// ==========================================
function ListenerDashboard({ user, requests, conversionRate, onCreateRequest }) {
  // 申請タブ: 'CONVERT' | 'INCREASE' | 'USE'
  const [activeTab, setActiveTab] = useState('CONVERT');
  // 履歴タブ: 'ALL' | 'PASSBOOK' | 'PENDING'
  const [historyFilter, setHistoryFilter] = useState('ALL');

  // 変換申請フォーム
  const [convertAmount, setConvertAmount] = useState('');
  const [convertNote, setConvertNote] = useState('');

  // 増額・利用申請フォーム
  const [reqCurrency, setReqCurrency] = useState('RIA');
  const [reqAmount, setReqAmount] = useState('');
  const [reqNote, setReqNote] = useState('');

  // 変換プレビュー計算
  const parsedConvert = Number(convertAmount) || 0;
  const previewRiaGained = parsedConvert > 0 ? parsedConvert * conversionRate : 0;
  const isConvertExceed = parsedConvert > user.premiumRiaCoin;

  // 増額・利用のバリデーション
  const parsedReqAmount = Number(reqAmount) || 0;
  const currentTargetBalance =
    reqCurrency === 'RIA' ? user.riaCoin : user.premiumRiaCoin;
  const isUseExceed =
    activeTab === 'USE' && parsedReqAmount > currentTargetBalance;

  // プリセット選択時の自動入力
  const applyPreset = (preset) => {
    setReqCurrency(preset.currency);
    setReqAmount(String(preset.amount));
    setReqNote(preset.note);
  };

  const submitConvert = (e) => {
    e.preventDefault();
    const ok = onCreateRequest({
      type: 'CONVERT',
      currency: 'PREMIUM',
      amount: parsedConvert,
      note: convertNote,
    });
    if (ok) {
      setConvertAmount('');
      setConvertNote('');
    }
  };

  const submitStandardRequest = (e) => {
    e.preventDefault();
    const ok = onCreateRequest({
      type: activeTab,
      currency: reqCurrency,
      amount: parsedReqAmount,
      note: reqNote,
    });
    if (ok) {
      setReqAmount('');
      setReqNote('');
    }
  };

  const filteredRequests = useMemo(() => {
    if (historyFilter === 'PASSBOOK') {
      return requests.filter((r) => r.status === 'APPROVED');
    }
    if (historyFilter === 'PENDING') {
      return requests.filter((r) => r.status === 'PENDING');
    }
    return requests;
  }, [requests, historyFilter]);

  const pendingUserReqs = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-7">
      {/* リスナー口座ステータスバー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-rose-100 rounded-2xl px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center font-extrabold text-white text-base shadow-md shadow-rose-500/20`}
          >
            {user.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base">{user.name}</h2>
              <span className="text-xs text-slate-400 font-mono">{user.handle}</span>
            </div>
            <p className="text-xs text-slate-500">
              RiaBank 公式認定口座 ・ 承認待ち申請:{' '}
              <span className="text-rose-600 font-extrabold">{pendingUserReqs}件</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-rose-50/80 px-3.5 py-2 rounded-xl border border-rose-200">
          <ArrowRightLeft className="w-3.5 h-3.5 text-rose-600" />
          <span className="text-slate-600 font-medium">現在の変換レート:</span>
          <span className="font-black text-rose-700">
            1 PRC = {conversionRate.toLocaleString()} RC
          </span>
        </div>
      </div>

      {/* 1. 銀行キャッシュカード風の保有残高UI（2通貨） */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* リアコイン残高カード（鮮やかなクリムゾンレッド×ホワイト文字） */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 text-white p-6 shadow-xl shadow-rose-600/20">
          <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-6 bottom-5 opacity-15 pointer-events-none">
            <RiaCoinSvg className="w-28 h-28" />
          </div>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm">
                <RiaCoinSvg className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-rose-100 block">
                  RIA COIN PASSBOOK
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  リアコイン（通常通貨）
                </h3>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 font-extrabold">
              STANDARD
            </span>
          </div>

          <div className="my-2">
            <p className="text-xs text-rose-100 mb-0.5 font-medium">現在の利用可能残高</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {user.riaCoin.toLocaleString()}
              </span>
              <span className="text-base font-extrabold text-rose-100">RC</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-rose-100">
            <span>配信特典・リクエスト交換用</span>
            <span className="font-mono font-bold">ACCT •••• {user.id.slice(-4)}</span>
          </div>
        </div>

        {/* プレミアムリアコイン残高カード（クリーンホワイト×レッド＆ゴールドアクセント） */}
        <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-rose-200 p-6 shadow-xl shadow-rose-500/5">
          <div className="absolute -right-10 -top-10 w-44 h-44 bg-rose-100/70 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-6 bottom-5 opacity-10 pointer-events-none">
            <PremiumRiaCoinSvg className="w-28 h-28" />
          </div>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-rose-50 border border-rose-200">
                <PremiumRiaCoinSvg className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-rose-600 block">
                  PREMIUM VIP CARD
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  プレミアムリアコイン（上位通貨）
                </h3>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white font-extrabold shadow-sm">
              VIP RUBY
            </span>
          </div>

          <div className="my-2">
            <p className="text-xs text-slate-500 mb-0.5 font-medium">現在の利用可能残高</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 bg-clip-text text-transparent font-mono">
                {user.premiumRiaCoin.toLocaleString()}
              </span>
              <span className="text-base font-extrabold text-rose-600">PRC</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              リアコイン換算相当:{' '}
              <strong className="text-rose-600 font-extrabold">
                {(user.premiumRiaCoin * conversionRate).toLocaleString()} RC
              </strong>
            </span>
            <span className="font-mono font-bold text-slate-400">VIP •••• {user.id.slice(-4)}</span>
          </div>
        </div>
      </div>

      {/* 2. 各種申請パネル & 3. 通帳・申請履歴 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左カラム：申請フォーム（7カラム） */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-rose-600" />
              <span>銀行窓口・各種申請フォーム</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">ライバー承認後に残高反映</span>
          </div>

          {/* 3種申請タブ */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('CONVERT')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${
                activeTab === 'CONVERT'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>変換申請</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('INCREASE')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${
                activeTab === 'INCREASE'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>増額・獲得申請</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('USE')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${
                activeTab === 'USE'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>特典利用申請</span>
            </button>
          </div>

          {/* ------------------------------------------
              タブ1：プレミアム ➔ リアコイン変換申請
             ------------------------------------------ */}
          {activeTab === 'CONVERT' && (
            <form onSubmit={submitConvert} className="space-y-5">
              {/* 方向制限のUI表示（逆方向はロック） */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-500 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-xs font-extrabold text-slate-900">
                      プレミアム ➔ リアコイン
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    変換可能
                  </span>
                </div>

                <div
                  className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between opacity-75 cursor-not-allowed select-none"
                  title="リアコインからプレミアムリアコインへの逆変換はできません"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-500 line-through">
                      リアコイン ➔ プレミアム
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                    逆変換不可
                  </span>
                </div>
              </div>

              {/* 変換ビジュアルカード */}
              <div className="flex items-center justify-between gap-2 bg-rose-50/50 border border-rose-100 rounded-2xl p-4">
                <div className="flex-1 text-center">
                  <div className="flex justify-center mb-1">
                    <PremiumRiaCoinSvg className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] text-amber-700 font-extrabold block">
                    変換元（消費）
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    プレミアムリアコイン
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    保有: {user.premiumRiaCoin.toLocaleString()} PRC
                  </span>
                </div>

                <div className="flex flex-col items-center px-2">
                  <span className="text-[11px] font-black text-rose-600 bg-white border border-rose-200 px-2.5 py-0.5 rounded-full mb-1.5 shadow-sm">
                    × {conversionRate.toLocaleString()}倍
                  </span>
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 text-center">
                  <div className="flex justify-center mb-1">
                    <RiaCoinSvg className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] text-rose-600 font-extrabold block">
                    変換先（獲得）
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    リアコイン
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    保有: {user.riaCoin.toLocaleString()} RC
                  </span>
                </div>
              </div>

              {/* 変換枚数入力 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    変換するプレミアムリアコイン数量
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 5, 10].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          setConvertAmount(String(Math.min(user.premiumRiaCoin, val)))
                        }
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold transition"
                      >
                        {val}枚
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setConvertAmount(String(user.premiumRiaCoin))}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold transition"
                    >
                      全額 ({user.premiumRiaCoin})
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    placeholder="変換する枚数を入力 (例: 5)"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 font-extrabold text-base outline-none transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-rose-600">
                    PRC
                  </span>
                </div>
                {isConvertExceed && (
                  <p className="mt-1.5 text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    保有残高（{user.premiumRiaCoin.toLocaleString()} PRC）を超えています。
                  </p>
                )}
              </div>

              {/* 計算プレビュー */}
              <div className="rounded-2xl bg-gradient-to-r from-rose-50 via-white to-rose-50 border border-rose-200 p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">
                    変換後に獲得できるリアコイン
                  </span>
                  <span className="text-[11px] text-slate-500">
                    計算式: {parsedConvert} PRC × {conversionRate.toLocaleString()} ={' '}
                    {previewRiaGained.toLocaleString()} RC
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-rose-600 font-mono">
                    +{previewRiaGained.toLocaleString()}
                  </span>
                  <span className="text-xs font-extrabold text-rose-600 ml-1">RC</span>
                </div>
              </div>

              {/* メモ */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  変換メモ・理由（任意）
                </label>
                <input
                  type="text"
                  value={convertNote}
                  onChange={(e) => setConvertNote(e.target.value)}
                  placeholder="例：企画参加用にリアコインへ変換お願いします！"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={parsedConvert <= 0 || isConvertExceed}
                className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                プレミアム ➔ リアコイン変換を申請する
              </button>
            </form>
          )}

          {/* ------------------------------------------
              タブ2 & 3：増額申請（獲得報告） / 利用申請（特典交換）
             ------------------------------------------ */}
          {(activeTab === 'INCREASE' || activeTab === 'USE') && (
            <form onSubmit={submitStandardRequest} className="space-y-5">
              {/* クイックプリセットボタン */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    <span>
                      {activeTab === 'INCREASE'
                        ? 'よく使う獲得報告プリセット（ワンタップ入力）'
                        : 'よく使う特典交換プリセット（ワンタップ入力）'}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(activeTab === 'INCREASE' ? INCREASE_PRESETS : USE_PRESETS).map(
                    (preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 ${
                          preset.currency === 'PREMIUM'
                            ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                        }`}
                      >
                        <span>{preset.label}</span>
                        <span className="font-mono font-extrabold">
                          ({preset.amount}
                          {preset.currency === 'PREMIUM' ? 'PRC' : 'RC'})
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 通貨選択 */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-2">
                  対象通貨を選択
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReqCurrency('RIA')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex items-center gap-3 ${
                      reqCurrency === 'RIA'
                        ? 'bg-rose-50/70 border-rose-600 text-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <RiaCoinSvg className="w-7 h-7 shrink-0" />
                    <div>
                      <span className="text-xs font-extrabold text-rose-600 block">
                        リアコイン
                      </span>
                      <p className="text-sm font-black text-slate-900 font-mono">
                        {user.riaCoin.toLocaleString()} RC
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReqCurrency('PREMIUM')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex items-center gap-3 ${
                      reqCurrency === 'PREMIUM'
                        ? 'bg-amber-50/70 border-amber-500 text-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <PremiumRiaCoinSvg className="w-7 h-7 shrink-0" />
                    <div>
                      <span className="text-xs font-extrabold text-amber-700 block">
                        プレミアム
                      </span>
                      <p className="text-sm font-black text-slate-900 font-mono">
                        {user.premiumRiaCoin.toLocaleString()} PRC
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 数量入力 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    {activeTab === 'INCREASE'
                      ? '増額申請するコイン数量'
                      : '利用（消費）するコイン数量'}
                  </label>
                  <span className="text-xs text-slate-500 font-semibold">
                    現在残高: {currentTargetBalance.toLocaleString()}{' '}
                    {reqCurrency === 'RIA' ? 'RC' : 'PRC'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={reqAmount}
                    onChange={(e) => setReqAmount(e.target.value)}
                    placeholder="数量を入力 (例: 300)"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 font-extrabold text-base outline-none transition"
                  />
                  <span
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold ${
                      reqCurrency === 'RIA' ? 'text-rose-600' : 'text-amber-700'
                    }`}
                  >
                    {reqCurrency === 'RIA' ? 'RC' : 'PRC'}
                  </span>
                </div>
                {isUseExceed && (
                  <p className="mt-1.5 text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    保有残高（{currentTargetBalance.toLocaleString()}）を超える利用申請はできません。
                  </p>
                )}
              </div>

              {/* 理由・メモ入力 */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  {activeTab === 'INCREASE'
                    ? '獲得理由・配信企画メモ'
                    : '交換したい特典名・利用目的'}
                </label>
                <input
                  type="text"
                  value={reqNote}
                  onChange={(e) => setReqNote(e.target.value)}
                  placeholder={
                    activeTab === 'INCREASE'
                      ? '例：11/19配信の歌枠クイズ正解ボーナス'
                      : '例：限定アイコンリング（冬バージョン）と交換希望'
                  }
                  className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={parsedReqAmount <= 0 || isUseExceed}
                className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {activeTab === 'INCREASE'
                  ? 'コイン増額（獲得報告）を申請する'
                  : '特典利用（コイン消費）を申請する'}
              </button>
            </form>
          )}
        </div>

        {/* 右カラム：通帳・申請ステータス履歴（5カラム） */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <span>デジタル通帳・申請履歴</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">{filteredRequests.length}件</span>
          </div>

          {/* 履歴フィルタタブ */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-4 text-xs font-extrabold">
            <button
              onClick={() => setHistoryFilter('ALL')}
              className={`py-1.5 rounded-lg transition ${
                historyFilter === 'ALL'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              すべて ({requests.length})
            </button>
            <button
              onClick={() => setHistoryFilter('PASSBOOK')}
              className={`py-1.5 rounded-lg transition ${
                historyFilter === 'PASSBOOK'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              通帳記帳済
            </button>
            <button
              onClick={() => setHistoryFilter('PENDING')}
              className={`py-1.5 rounded-lg transition ${
                historyFilter === 'PENDING'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              承認待ち ({pendingUserReqs})
            </button>
          </div>

          {/* リスト本体 */}
          <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1 flex-1">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm font-medium">
                該当する取引・申請履歴はありません
              </div>
            ) : (
              filteredRequests.map((req) => (
                <TransactionItem key={req.id} req={req} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 通帳・履歴カードコンポーネント（白×赤スタイル）
// ==========================================
function TransactionItem({ req }) {
  const isConvert = req.type === 'CONVERT';
  const isIncrease = req.type === 'INCREASE';

  return (
    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-rose-200 transition">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* 種別バッジ */}
          {isConvert ? (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" />
              通貨変換
            </span>
          ) : isIncrease ? (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              ＋増額・入帳
            </span>
          ) : (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              ー特典利用
            </span>
          )}

          {/* ステータスバッジ */}
          {req.status === 'PENDING' && (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              承認待ち
            </span>
          )}
          {req.status === 'APPROVED' && (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Check className="w-3 h-3" />
              記帳済
            </span>
          )}
          {req.status === 'REJECTED' && (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              却下
            </span>
          )}
        </div>

        {/* 金額表示 */}
        <div className="text-right font-mono">
          {isConvert ? (
            <div className="text-xs font-black">
              <span className="text-amber-700">-{req.amount} PRC</span>
              <span className="text-slate-400 mx-1">➔</span>
              <span className="text-rose-600">
                +{(req.convertedAmount || 0).toLocaleString()} RC
              </span>
            </div>
          ) : (
            <span
              className={`text-sm font-black ${
                isIncrease ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isIncrease ? '+' : '-'}
              {req.amount.toLocaleString()}{' '}
              <span className="text-xs">
                {req.currency === 'PREMIUM' ? 'PRC' : 'RC'}
              </span>
            </span>
          )}
        </div>
      </div>

      <p className="text-xs font-medium text-slate-700 leading-relaxed mb-1.5">{req.note}</p>
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>申請: {req.createdAt}</span>
        {req.processedAt && <span>反映: {req.processedAt}</span>}
      </div>
    </div>
  );
}

// ==========================================
// ライバー（管理者）側ダッシュボード（白×赤デザイン＆パスワード設定付き）
// ==========================================
function LiverDashboard({
  users,
  requests,
  settings,
  onProcessRequest,
  onBulkApprove,
  onDirectAdjust,
  onUpdateRate,
  onUpdatePassword,
  onLockLiver,
  onOpenAddUser,
}) {
  // 直接残高調整フォームステート
  const [targetUserId, setTargetUserId] = useState(users[0]?.id || 'user-1');
  const [adjCurrency, setAdjCurrency] = useState('RIA');
  const [adjOp, setAdjOp] = useState('ADD');
  const [adjAmount, setAdjAmount] = useState('');
  const [adjReason, setAdjReason] = useState('');

  // レート設定入力
  const [rateInput, setRateInput] = useState(String(settings.conversionRate));

  // パスワード変更入力
  const [newPasswordInput, setNewPasswordInput] = useState('');

  useEffect(() => {
    setRateInput(String(settings.conversionRate));
  }, [settings.conversionRate]);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === 'PENDING'),
    [requests]
  );

  const processedRequests = useMemo(
    () => requests.filter((r) => r.status !== 'PENDING'),
    [requests]
  );

  // 総流通量集計
  const totalRia = useMemo(
    () => users.reduce((acc, u) => acc + u.riaCoin, 0),
    [users]
  );
  const totalPremium = useMemo(
    () => users.reduce((acc, u) => acc + u.premiumRiaCoin, 0),
    [users]
  );

  // ランキング順（リアコイン換算順）
  const rankedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const scoreA = a.riaCoin + a.premiumRiaCoin * settings.conversionRate;
      const scoreB = b.riaCoin + b.premiumRiaCoin * settings.conversionRate;
      return scoreB - scoreA;
    });
  }, [users, settings.conversionRate]);

  const submitDirectAdjust = (e) => {
    e.preventDefault();
    const ok = onDirectAdjust({
      userId: targetUserId,
      currency: adjCurrency,
      operation: adjOp,
      amount: adjAmount,
      reason: adjReason,
    });
    if (ok) {
      setAdjAmount('');
      setAdjReason('');
    }
  };

  const submitPasswordChange = (e) => {
    e.preventDefault();
    const ok = onUpdatePassword(newPasswordInput);
    if (ok) {
      setNewPasswordInput('');
    }
  };

  return (
    <div className="space-y-8">
      {/* ライバー専用セキュリティバナー */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white rounded-3xl p-5 shadow-lg shadow-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black">
                ライバー管理コンソール（認証済み）
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-rose-600">
                ADMIN UNLOCKED
              </span>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              申請の承認・却下、残高の直接付与、変換レートやパスワードの変更が行えます。操作終了後はロックしてください。
            </p>
          </div>
        </div>
        <button
          onClick={onLockLiver}
          className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-white hover:bg-rose-50 text-rose-700 shadow-sm flex items-center justify-center gap-1.5 shrink-0 transition"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>ロックしてリスナー画面へ戻る</span>
        </button>
      </div>

      {/* 1. ライバー管理サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-rose-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-extrabold text-rose-600 uppercase">
              承認待ちリクエスト
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">
              {pendingRequests.length}{' '}
              <span className="text-sm font-bold text-slate-500">件</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-extrabold text-slate-500 uppercase">
              総発行リアコイン残高
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">
              {totalRia.toLocaleString()}{' '}
              <span className="text-sm font-extrabold text-rose-600">RC</span>
            </p>
          </div>
          <RiaCoinSvg className="w-11 h-11" />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-extrabold text-slate-500 uppercase">
              総発行プレミアム残高
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1 font-mono">
              {totalPremium.toLocaleString()}{' '}
              <span className="text-sm font-extrabold text-amber-600">PRC</span>
            </p>
          </div>
          <PremiumRiaCoinSvg className="w-11 h-11" />
        </div>
      </div>

      {/* 2. 承認待ち申請リスト（一括承認ボタン付き） */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              リスナーからの承認待ち申請キュー
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-rose-100 text-rose-700 border border-rose-200">
              {pendingRequests.length}件
            </span>
          </div>

          {pendingRequests.length > 0 && (
            <button
              onClick={onBulkApprove}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-500/20 transition"
            >
              <CheckCheck className="w-4 h-4" />
              <span>すべての承認待ちを一括承認 ({pendingRequests.length}件)</span>
            </button>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-10 text-center">
            <CheckCircle2 className="w-10 h-10 text-rose-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-extrabold text-slate-800">
              現在、承認待ちの申請はありません
            </p>
            <p className="text-xs text-slate-500 mt-1">
              リスナーから新しい申請が届くとここに一覧表示されます。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => {
              const reqUser = users.find((u) => u.id === req.userId);
              const isConvert = req.type === 'CONVERT';
              const isIncrease = req.type === 'INCREASE';

              return (
                <div
                  key={req.id}
                  className="rounded-2xl bg-slate-50/70 border border-slate-200 p-4 flex flex-col justify-between gap-4 hover:border-rose-300 transition shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                        {req.userName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {req.createdAt}
                      </span>
                    </div>

                    {/* 申請内容サマリーボックス */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between mb-2.5">
                      <div>
                        {isConvert ? (
                          <span className="text-xs font-extrabold text-amber-700 flex items-center gap-1">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            プレミアム ➔ リア変換
                          </span>
                        ) : isIncrease ? (
                          <span className="text-xs font-extrabold text-emerald-700">
                            ＋ コイン増額（獲得申請）
                          </span>
                        ) : (
                          <span className="text-xs font-extrabold text-rose-600">
                            ー コイン利用（特典交換）
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          現在残高: {reqUser?.riaCoin.toLocaleString()} RC /{' '}
                          {reqUser?.premiumRiaCoin.toLocaleString()} PRC
                        </span>
                      </div>

                      <div className="text-right font-mono">
                        {isConvert ? (
                          <div>
                            <span className="text-xs font-bold text-amber-700 block">
                              -{req.amount} PRC
                            </span>
                            <span className="text-sm font-black text-rose-600">
                              +{(req.convertedAmount || 0).toLocaleString()} RC
                            </span>
                          </div>
                        ) : (
                          <span
                            className={`text-base font-black ${
                              isIncrease ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isIncrease ? '+' : '-'}
                            {req.amount.toLocaleString()}{' '}
                            {req.currency === 'PREMIUM' ? 'PRC' : 'RC'}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-medium text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                      {req.note}
                    </p>
                  </div>

                  {/* ワンタップ承認・却下ボタン */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => onProcessRequest(req.id, 'REJECTED')}
                      className="py-2.5 px-3 rounded-xl text-xs font-extrabold bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 flex items-center justify-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4 text-slate-500" />
                      <span>却下する</span>
                    </button>
                    <button
                      onClick={() => onProcessRequest(req.id, 'APPROVED')}
                      className="py-2.5 px-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>承認して残高反映</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. 全リスナー残高一覧・ランキング & 直接調整・レート・パスワード管理 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左カラム：リスナー残高ランキング一覧（7カラム） */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-rose-600" />
              <span>全リスナー残高一覧・ランキング</span>
            </h3>
            <button
              onClick={onOpenAddUser}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>新規リスナー登録</span>
            </button>
          </div>

          <div className="space-y-3">
            {rankedUsers.map((u, idx) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                      idx === 0
                        ? 'bg-rose-600 text-white'
                        : idx === 1
                        ? 'bg-rose-200 text-rose-900'
                        : idx === 2
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${u.avatarColor} flex items-center justify-center font-bold text-white text-sm shadow-sm`}
                  >
                    {u.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{u.handle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:justify-end border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-rose-600 block">
                      リアコイン
                    </span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {u.riaCoin.toLocaleString()}{' '}
                      <span className="text-xs text-rose-600">RC</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-amber-700 block">
                      プレミアム
                    </span>
                    <span className="text-base font-black text-amber-700 font-mono">
                      {u.premiumRiaCoin.toLocaleString()}{' '}
                      <span className="text-xs">PRC</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右カラム：直接付与・減算 & レート設定 & パスワード設定（5カラム） */}
        <div className="lg:col-span-5 space-y-6">
          {/* 直接残高調整フォーム */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-rose-600" />
              <span>ライバー直接付与・減算調整</span>
            </h3>

            <form onSubmit={submitDirectAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  対象リスナー
                </label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-bold outline-none"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} (RC: {u.riaCoin.toLocaleString()} / PRC: {u.premiumRiaCoin})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    対象通貨
                  </label>
                  <select
                    value={adjCurrency}
                    onChange={(e) => setAdjCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-extrabold text-slate-900 outline-none"
                  >
                    <option value="RIA">リアコイン (RC)</option>
                    <option value="PREMIUM">プレミアム (PRC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    操作内容
                  </label>
                  <select
                    value={adjOp}
                    onChange={(e) => setAdjOp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-extrabold text-slate-900 outline-none"
                  >
                    <option value="ADD">＋ 直接付与（増やす）</option>
                    <option value="SUBTRACT">ー 直接減算（減らす）</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  数量
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  placeholder="例: 500"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  通帳記帳メモ
                </label>
                <input
                  type="text"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="例：配信イベント特別MVPボーナス"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-500/20 transition"
              >
                残高に即時反映する
              </button>
            </form>
          </div>

          {/* 変換レート設定パネル */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-2">
              <ArrowRightLeft className="w-5 h-5 text-rose-600" />
              <span>変換レート設定（プレミアム ➔ リア）</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              プレミアムリアコイン1枚あたり何リアコインに変換できるかを設定します。
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-700 shrink-0">
                1 PRC =
              </span>
              <input
                type="number"
                min="1"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-3.5 py-2 text-sm font-extrabold text-slate-900 outline-none"
              />
              <span className="text-xs font-extrabold text-rose-600 shrink-0">RC</span>
              <button
                type="button"
                onClick={() => onUpdateRate(rateInput)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white shrink-0 transition"
              >
                保存
              </button>
            </div>
          </div>

          {/* ライバー認証パスワード変更設定パネル */}
          <div className="bg-white border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-2">
              <KeyRound className="w-5 h-5 text-rose-600" />
              <span>ライバー認証パスワード設定</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              ライバー管理画面に入るための暗証番号・パスワードを変更できます（現在:{' '}
              <span className="font-mono font-bold text-rose-600">
                {settings.liverPassword}
              </span>
              ）。
            </p>

            <form onSubmit={submitPasswordChange} className="flex items-center gap-2">
              <input
                type="text"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="新しいパスワードを入力"
                className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-rose-600 text-white shrink-0 transition"
              >
                変更保存
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 4. 処理済み履歴ログ */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-rose-600" />
          <span>全体の承認済み・却下済み取引ログ ({processedRequests.length}件)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {processedRequests.map((req) => (
            <div key={req.id} className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500 px-1">
                口座: {req.userName}
              </span>
              <TransactionItem req={req} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}