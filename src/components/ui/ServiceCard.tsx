import type { Service } from '../../types';
import { serviceIconLib } from './Icon';

export function ServiceCard({ service }: { service: Service }) {
  const Icon = serviceIconLib[service.icon] ?? serviceIconLib.code;

  return (
    <article className="group flex flex-col h-full p-6 sm:p-7 bg-white border border-[#ebebeb] rounded-lg transition-all duration-300 hover:border-[#a1a1a1] hover:-translate-y-0.5">
      <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#f5f5f5] text-[#171717] mb-4 transition-colors duration-300 group-hover:bg-[#171717] group-hover:text-white">
        <Icon size={22} />
      </span>
      <h3 className="text-[16px] font-semibold text-[#171717] mb-2">{service.title}</h3>
      <p className="text-[14px] leading-relaxed text-[#4d4d4d]">{service.description}</p>
    </article>
  );
}
