'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  LogIn,
  MapPin,
  Search,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { authenticateUser, lookupAddressByCep } from '@/lib/api';
import { getStoreName } from '@/lib/store-helpers';
import { UserProfile } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'register',
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  const [prevProps, setPrevProps] = useState({ isOpen, initialMode });
  if (isOpen !== prevProps.isOpen || initialMode !== prevProps.initialMode) {
    setPrevProps({ isOpen, initialMode });
    if (isOpen) {
      setMode(initialMode);
      setAuthError('');
      setCepError('');
    }
  }

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  if (!isOpen) return null;

  const storeName = getStoreName();

  const handleCepLookup = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsSearchingCep(true);
    setCepError('');

    try {
      const data = await lookupAddressByCep(cleanCep);
      setRegisterForm((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível buscar o CEP automaticamente. Digite o endereço manualmente.';
      setCepError(message);
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegisterForm((prev) => ({ ...prev, zipCode: value }));
    if (value.replace(/\D/g, '').length === 8) {
      handleCepLookup(value);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      const user = await authenticateUser({
        action: 'login',
        identifier: loginForm.email,
        password: loginForm.password,
      });
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Erro ao acessar conta. Verifique seus dados.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      const user = await authenticateUser({
        action: 'register',
        ...registerForm,
      });
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Erro ao finalizar cadastro. Verifique os campos.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'register' ? 'Criar Conta' : 'Acessar Sua Conta'}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 relative my-6"
      >
        <div className="p-6 bg-[#1F1F1F] text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#C92071] rounded-lg flex items-center justify-center text-white font-black text-sm">
                DS
              </div>
              <span className="text-lg font-black tracking-tight">{storeName}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar janela de autenticação"
              className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-2">
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-white">
              {mode === 'register' ? (
                <>
                  <UserPlus className="w-5 h-5 text-[#C92071]" />
                  <span>Criar Conta na Drip Store</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 text-[#C92071]" />
                  <span>Acessar Sua Conta</span>
                </>
              )}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {mode === 'register'
                ? 'Preencha seus dados pessoais e de endereço completo abaixo.'
                : 'Informe suas credenciais para entrar no seu perfil.'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C92071] block pb-1 border-b border-gray-100">
                  1. Dados Pessoais
                </span>

                <div>
                  <label htmlFor="reg-name" className="font-extrabold text-gray-700 block mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="Digite seu nome completo"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="font-extrabold text-gray-700 block mb-1">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="reg-cpf" className="font-extrabold text-gray-700 block mb-1">
                      CPF *
                    </label>
                    <input
                      id="reg-cpf"
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={registerForm.cpf}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, cpf: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="font-extrabold text-gray-700 block mb-1">
                      Celular / WhatsApp *
                    </label>
                    <input
                      id="reg-phone"
                      type="text"
                      required
                      placeholder="(00) 00000-0000"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="font-extrabold text-gray-700 block mb-1">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C92071] flex items-center justify-between pb-1 border-b border-gray-100">
                  <span>2. Endereço Completo de Entrega</span>
                  <span className="text-[10px] text-gray-400 font-normal">Preenchimento por CEP</span>
                </span>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="reg-cep" className="font-extrabold text-gray-700">
                      CEP *
                    </label>
                    {isSearchingCep && (
                      <span className="text-[10px] text-[#C92071] font-bold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Buscando endereço...
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C92071]" />
                    <input
                      id="reg-cep"
                      type="text"
                      required
                      placeholder="00000-000"
                      maxLength={9}
                      value={registerForm.zipCode}
                      onChange={handleZipCodeChange}
                      onBlur={() => handleCepLookup(registerForm.zipCode)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleCepLookup(registerForm.zipCode)}
                      aria-label="Buscar CEP"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C92071] cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  {cepError && (
                    <p className="text-[10px] text-amber-600 font-bold mt-1">{cepError}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label htmlFor="reg-street" className="font-extrabold text-gray-700 block mb-1">
                      Logradouro / Rua *
                    </label>
                    <input
                      id="reg-street"
                      type="text"
                      required
                      placeholder="Rua, Avenida..."
                      value={registerForm.street}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, street: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-number" className="font-extrabold text-gray-700 block mb-1">
                      Número *
                    </label>
                    <input
                      id="reg-number"
                      type="text"
                      required
                      placeholder="Nº"
                      value={registerForm.number}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, number: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="reg-complement" className="font-extrabold text-gray-700 block mb-1">
                      Complemento / Ref.
                    </label>
                    <input
                      id="reg-complement"
                      type="text"
                      placeholder="Apto, Bloco..."
                      value={registerForm.complement}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, complement: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-neighborhood" className="font-extrabold text-gray-700 block mb-1">
                      Bairro *
                    </label>
                    <input
                      id="reg-neighborhood"
                      type="text"
                      required
                      placeholder="Seu bairro"
                      value={registerForm.neighborhood}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, neighborhood: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label htmlFor="reg-city" className="font-extrabold text-gray-700 block mb-1">
                      Cidade *
                    </label>
                    <input
                      id="reg-city"
                      type="text"
                      required
                      placeholder="Sua cidade"
                      value={registerForm.city}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, city: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-state" className="font-extrabold text-gray-700 block mb-1">
                      Estado (UF) *
                    </label>
                    <input
                      id="reg-state"
                      type="text"
                      required
                      maxLength={2}
                      placeholder="UF"
                      value={registerForm.state}
                      onChange={(e) =>
                        setRegisterForm((p) => ({ ...p, state: e.target.value.toUpperCase() }))
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden uppercase font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C92071] hover:bg-[#991956] text-white font-black text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro com Endereço'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center border-t border-gray-100">
                <span className="text-[11px] text-gray-500">
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError('');
                      setMode('login');
                    }}
                    className="text-[#C92071] font-bold hover:underline cursor-pointer"
                  >
                    Entrar agora
                  </button>
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="login-identifier" className="font-extrabold text-gray-700 block mb-1">
                  E-mail ou CPF *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="font-extrabold text-gray-700 block mb-1">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full pl-9 pr-10 py-3 rounded-xl border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C92071] hover:bg-[#991956] text-white font-black text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Acessando...' : 'Acessar Conta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center border-t border-gray-100">
                <span className="text-[11px] text-gray-500">
                  Ainda não é cadastrado?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError('');
                      setMode('register');
                    }}
                    className="text-[#C92071] font-bold hover:underline cursor-pointer"
                  >
                    Cadastre-se grátis
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
