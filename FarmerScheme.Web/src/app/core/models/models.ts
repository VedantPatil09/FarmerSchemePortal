export enum RoleType {
  Farmer = 'Farmer',
  Bidder = 'Bidder',
  Admin = 'Admin'
}

export enum BaseStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum SellRequestStatus {
  Pending = 'Pending',
  Active = 'Active',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

export enum ProfileType {
  Farmer = 0,
  Bidder = 1
}

export enum SeasonType {
  Kharif = 0,
  Rabi = 1,
  Summer = 2
}

export enum ZoneType {
  North = 0,
  South = 1,
  East = 2,
  West = 3,
  Central = 4
}

export enum DocumentType {
  AadhaarCard = 0,
  PanCard = 1,
  BankPassbook = 2,
  LandOwnershipProof = 3,
  CropDamageProof = 4
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserAuthInfo {
  id: number;
  email: string;
  role: RoleType;
  fullName?: string;
  token: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: RoleType | number;
  isApproved?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface DocumentResponse {
  id: number;
  documentType: DocumentType | number;
  filePath: string;
}

export interface ProfileResponse {
  user: UserResponse;
  profileType: ProfileType | number;
  landArea?: number;
  landAddress?: string;
  companyName?: string;
  bankAccountNumber: string;
  ifscCode: string;
  documents: DocumentResponse[];
}

export interface CreateProfileDto {
  profileType: ProfileType | number;
  landArea?: number;
  landAddress?: string;
  companyName?: string;
  bankAccountNumber: string;
  ifscCode: string;
  documents: { documentType: DocumentType | number; filePath: string }[];
}

export interface CropResponse {
  id: number;
  cropName: string;
  cropType: string;
  soilType: string;
  season: string;
  location: string;
  quantity: number;
  basePrice: number;
  status: BaseStatus | number;
  farmerId: number;
  createdAt: string;
}

export interface CreateCropDto {
  cropName: string;
  cropType: string;
  soilType: string;
  season: string;
  location: string;
  quantity: number;
  basePrice: number;
}

export interface SellRequestResponse {
  id: number;
  cropId: number;
  cropName: string;
  quantity: number;
  basePrice: number;
  status: SellRequestStatus | number;
  currentHighestBid?: number;
  winnerBidderId?: number;
  winnerBidderName?: string;
  winningAmount?: number;
  closedAt?: string;
  createdAt: string;
}

export interface OpenAuctionItem {
  sellRequestId: number;
  cropName: string;
  quantity: number;
  basePrice: number;
  currentHighestBid?: number;
}

export interface BidResponse {
  id: number;
  sellRequestId: number;
  bidderId: number;
  bidderName: string;
  bidAmount: number;
  isWinningBid: boolean;
  bidTime: string;
  createdAt: string;
}

export interface PlaceBidDto {
  sellRequestId: number;
  bidAmount: number;
}

export interface InsuranceApplicationResponse {
  id: number;
  farmerId: number;
  farmerName: string;
  cropId: number;
  cropName: string;
  season: SeasonType | number;
  zone: ZoneType | number;
  landArea: number;
  sumInsured: number;
  premiumAmount: number;
  status: BaseStatus | number;
  createdAt: string;
}

export interface CreateInsuranceApplicationDto {
  cropId: number;
  cropName: string;
  season: SeasonType | number;
  zone: ZoneType | number;
  landArea: number;
  sumInsured: number;
}

export interface ClaimResponse {
  id: number;
  insuranceApplicationId: number;
  cropName: string;
  farmerName: string;
  causeOfLoss: string;
  dateOfLoss: string;
  status: string;
  createdAt: string;
  damageProofFiles: string[];
}

export interface CreateClaimDto {
  insuranceApplicationId: number;
  causeOfLoss: string;
  dateOfLoss: string;
  damageProofFilePath: string;
}

export interface AIQueryLog {
  id: number;
  cropId: number;
  farmerId: number;
  promptUsed: string;
  aiResponse: string;
  createdAt: string;
  crop?: CropResponse;
}

export interface AskAiDto {
  cropId: number;
  prompt: string;
}
